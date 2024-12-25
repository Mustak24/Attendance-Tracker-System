import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    organizationNo: {
        type: Number,
        require: true,
        unique: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

organizationSchema.methods.createToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_KEY);
}

organizationSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

organizationSchema.statics.createHash = function(data){
    return bcrypt.hashSync(data, 10);
}


const organizationModel = mongoose.models.organization || mongoose.model('organization', organizationSchema);

export default organizationModel;