import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const wardenSchema = new mongoose.Schema({
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
    hostelNo: {
        type: Number,
        require: true,
        unique: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

wardenSchema.methods.createToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_KEY);
}

wardenSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

wardenSchema.statics.createHash = function(data){
    return bcrypt.hashSync(data, 10);
}


const wardenModel = mongoose.models.warden || mongoose.model('warden', wardenSchema);

export default wardenModel;