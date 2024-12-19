import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 50
    },
    username: {
        type: String,
        required: true,
        unique: true,
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
        type: Number,
        required: true,
    },
    roomNo:{
        type: Number,
        required: true
    },
    hostelNo: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    attendenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'attendence'
    }
});

userSchema.methods.createToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_KEY);
}

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

userSchema.statics.createHash = function(password){
    return bcrypt.hashSync(password, 10);
}

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;