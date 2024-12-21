import mongoose from 'mongoose';


const attendenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    dates: {
        type: Object,
        of: {
            type: Object,
            of: {
                type: Object,
                of: Object
            }
        }
    },
    statuses: {
        type: Object,
        of: Object
    }
});

attendenceSchema.methods.markAttendence = function(isPresent){
    let date = new Date().toLocaleDateString().split('/');
    
    this.statuses[date.join('/')] = {
        status:  isPresent ? 'present' : 'absent',
        isPresent,
        time: new Date()
    };

    this.dates = this.dates || {};
    this.dates[date[2]] = this.dates[date[2]] || {};
    this.dates[date[2]][date[1]] = this.dates[date[2]][date[1]] || {};
    this.dates[date[2]][date[1]][date[0]] = this.statuses[date.join('/')];
}

attendenceSchema.methods.getTodayStatus = function(){
    let date = new Date().toLocaleDateString();
    let attendenceStatus = this.statuses[date];
    attendenceStatus = attendenceStatus?.status || 'not marked';
    return attendenceStatus;
}


const attendenceModel = mongoose.models.attendence ||  mongoose.model('attendence', attendenceSchema);

export default attendenceModel;