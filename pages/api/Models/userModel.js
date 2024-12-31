import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import vaildTokenModel from './vaildTokenModel';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    username: {
        type: String,
        required: true,
        unique: true,
        select: false,
        min: 6,
        max: 50
    },
    password: {
        type: String,
        required: true,
        select: false,
        min: 6,
        max: 50,
    },
    mobileNo: {
        type: String,
        required: true,
        select: false,
        min: 10,
        max: 10
    },
    roomNo:{
        type: Number,
        required: true
    },
    organizationNo: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        select: false
    },
    attendanceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'attendance'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    }
});

userSchema.methods.createToken = async function(){
    await vaildTokenModel.deleteMany({id: this._id, role: 'user'});
    let token = await vaildTokenModel.create({id: this._id, role: 'user'});
    return jwt.sign({id: token._id}, process.env.JWT_KEY);
}

userSchema.statics.isValidToken = async function(token){
    token = jwt.verify(token, process.env.JWT_KEY);

    let vaildToken = await vaildTokenModel.findById(token.id);
    if(!(vaildToken && vaildToken.role === 'user')) throw new Error('invalid-token');
    
    let user = await this.findById(vaildToken.id);
    if(!user) throw new Error('invalid-token');
    
    return user;
}

userSchema.statics.removeToken = async function(token){
    token = jwt.verify(token, process.env.JWT_KEY);

    let vaildToken = await vaildTokenModel.findById(token.id);
    if(!(vaildToken && vaildToken.role === 'user')) throw new Error('invalid-token');
    
    await vaildTokenModel.findByIdAndDelete(token.id);
}

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

userSchema.statics.createHash = function(password){
    return bcrypt.hashSync(password, 10);
}

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;