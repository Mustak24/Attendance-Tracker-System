import mongoose from 'mongoose';


const attendenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    wardenId: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'warden'
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
        of: {
            type: String,
            enum: ['present', 'absent', 'not mark'],
            default: 'not mark'
        }
    }
});

attendenceSchema.methods.markAttendence = function(isPresent){
    let date = new Date().toLocaleDateString().split('/');
    
    this.status = this.status || {}
    this.status[date.join('/')] = isPresent ? 'present' : 'absent'

    this.attendences = this.attendences || {};
    this.attendences[date[2]] = this.attendences[date[2]] || {};
    this.attendences[date[2]][date[1]] = this.attendences[date[2]][date[1]] || {};
    this.attendences[date[2]][date[1]][date[0]] = {
        status: isPresent ? 'present' : 'absent',
        isPresent,
        time: new Date()
    };
}

attendenceSchema.methods.getTodayStatus = function(){
    let date = new Date().toLocaleDateString();
    this.status = this.status || {};
    return this.status[date] || 'not mark';
}

attendenceSchema.methods.addProperty = function(key, value){
    this[key] = value;
}

attendenceSchema.methods.getAttendenceStatus = function({mounth, year}){
    year = year || new Date().getFullYear();
    mounth = mounth || new Date().getMonth() + 1;

    let status = this.status || {};

    return Array.from({
        length: new Date(year, mounth, 0).getDate()
    }).map((_, index) => [index+1, status[`${index+1}/${mounth}/${year}`] || 'not mark'])
}


attendenceSchema.methods.getPresentDays = function({mounth=null, year=null}){
    year = year || new Date().getFullYear();
    mounth = mounth || new Date().getMonth() + 1;

    let attendence = this.attendences || {};
    attendence = attendence[year] || {};
    attendence = attendence[mounth] || {};

    let presentDays = []
    for(let key in attendence){
        if(attendence[key].isPresent) presentDays.push(key);
    }

    return presentDays;
}


const attendenceModel = mongoose.models.attendence ||  mongoose.model('attendence', attendenceSchema);

export default attendenceModel;