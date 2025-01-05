import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import vaildTokenModel from './vaildTokenModel';

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
        type: String,
        require: true,
        unique: true
    },
    ip: {
        type: String,
        require: true
    },
    attendanceTime: {
        time: {
            type: String,
            default: '21:00'
        },
        duration: {
            type: Number,
            default: 1
        }
    },
    time: {
        type: Date,
        default: Date.now
    },
});

organizationSchema.methods.getAttendanceTimeRange = function(){
    let {time, duration} = this.attendanceTime;
    time = time.split(':').map(Number);
    time = time[0]+time[1]/60
    return [time, time+duration, duration]
}

organizationSchema.methods.createToken = async function(){
    await vaildTokenModel.deleteMany({id: this._id, role: 'organization'});
    let token = await vaildTokenModel.create({id: this._id, role: 'organization'});
    return jwt.sign({id: token._id}, process.env.JWT_KEY);
}

organizationSchema.statics.isValidToken = async function(token){
    token = jwt.verify(token, process.env.JWT_KEY);

    let vaildToken = await vaildTokenModel.findById(token.id);
    if(!(vaildToken && vaildToken.role === 'organization')) throw new Error('invalid-token');
    
    let organization = await this.findById(vaildToken.id);
    if(!organization) throw new Error('invalid-token');
    
    return organization;
}

organizationSchema.statics.removeToken = async function(token){
    token = jwt.verify(token, process.env.JWT_KEY);

    let vaildToken = await vaildTokenModel.findById(token.id);
    if(!(vaildToken && vaildToken.role === 'organization')) throw new Error('invalid-token');
    
    await vaildTokenModel.findByIdAndDelete(token.id);
}

organizationSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

organizationSchema.statics.createHash = function(data){
    return bcrypt.hashSync(data, 10);
}


const organizationModel = mongoose.models.organization || mongoose.model('organization', organizationSchema);

export default organizationModel;