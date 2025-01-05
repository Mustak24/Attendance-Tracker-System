import mongoose from 'mongoose';
import organizationModel from './organizationModel';
import { getIp } from '@/Functions/miniFuntions';


const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'organization'
    },
    status: {
        type: Map,
        of: {
            type: String,
        },
        default: new Map()
    }
});

attendanceSchema.methods.markAttendance = async function(isPresent, date=null){
    if(!date){
        let time = new Date().toLocaleDateString().split('/');
        date = `${time[1]}/${time[0]}/${time[2]}`;
    }
    
    this.status.set(date, isPresent ? 'present' : 'absent');

    await this.save();
}

attendanceSchema.methods.getTodayStatus = function(){
    let date = new Date().toLocaleDateString().split('/');
    return this.status.get(`${date[1]}/${date[0]}/${date[2]}`) || 'not mark';
}

attendanceSchema.methods.addProperty = function(key, value){
    this[key] = value;
}

attendanceSchema.methods.getAttendanceStatus = function({mounth, year}){
    year = year || new Date().getFullYear();
    mounth = mounth || new Date().getMonth() + 1;

    return Array.from({
        length: new Date(year, mounth, 0).getDate()
    }).map((_, index) => [index+1, this.status.get(`${index+1}/${mounth}/${year}`) || 'not mark'])
}


attendanceSchema.methods.getPresentDays = function({mounth=null, year=null}){
    year = year || new Date().getFullYear();
    mounth = mounth || new Date().getMonth() + 1;

    let days = new Date(year, mounth, 0).getDate();
    let  presentDays = []

    for(let i=0; i<days; i++){
        if(this.status.get(`${i+1}/${mounth}/${year}`) == 'present') {
            presentDays.push(i+1);
        }
    }

    return presentDays;   
}

attendanceSchema.methods.isValidIp = async function(){
    let userIP = await getIp();
    let organization = await organizationModel.findById(this.organizationId);
    return Boolean(organization.ip == userIP);
}


attendanceSchema.statics.getTotalPresentUsers = async function(organizationId, date=null){
    if(!date){
        let time = new Date().toLocaleDateString().split('/');
        date = `${time[1]}/${time[0]}/${time[2]}`;
    }
    let attendaceInfo = await this.find({organizationId});
    let presentUsers = [];
    for(let attendance of attendaceInfo){
        if(attendance?.status.get(date) == 'present') presentUsers.push(attendance.userId);
    }
    return presentUsers;
}


const attendanceModel = mongoose.models.attendance ||  mongoose.model('attendance', attendanceSchema);

export default attendanceModel;