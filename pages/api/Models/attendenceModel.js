import mongoose from 'mongoose';


const attendenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    attendences: {
        type: Object,
        of: {
            type: Object,
            of: {
                type: Object,
                of: Object
            }
        }
    },
    status: {
        type: Object,
        of: Object
    }
});

attendenceSchema.methods.markAttendence = function(isPresent){
    let date = new Date().toLocaleDateString().split('/');
    
    this.status[date.join('/')] = {
        status:  isPresent ? 'present' : 'absent',
        isPresent,
        time: new Date()
    };

    this.attendences = this.attendences || {};
    this.attendences[date[2]] = this.attendences[date[2]] || {};
    this.attendences[date[2]][date[1]] = this.attendences[date[2]][date[1]] || {};
    this.attendences[date[2]][date[1]][date[0]] = this.statuses[date.join('/')];
}

attendenceSchema.methods.getTodayStatus = function(){
    let date = new Date().toLocaleattendencestring();
    let attendenceStatus = this.status[date];
    attendenceStatus = attendenceStatus?.status || 'not marked';
    return attendenceStatus;
}

attendenceSchema.methods.getPresentDays = function({mounth, year}){
    year = year || new Date().getFullYear();
    mounth = mounth || new Date().getMonth();
    let attendence = this.attendences[year][mounth];
    let presentDays = []

    for(let key in attendence){
        if(attendence[key].isPresent) presentDays.push(key);
    }

    return presentDays;
}


const attendenceModel = mongoose.models.attendence ||  mongoose.model('attendence', attendenceSchema);

export default attendenceModel;