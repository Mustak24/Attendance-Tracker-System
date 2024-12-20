import mongoose from 'mongoose';

const attendenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: Object,
        default: {}
    },
    dates: {
       type: Object,
       default: {},
    }
});

attendenceSchema.methods.markAttendence = function(ip){
    let date = new Date().toLocaleDateString().split('/');
    let isPresent = Boolean(ip == process.env.HOSTEL_IP);

    if(!this.status) this.status = {}
    this.status[date.join('/')] = {
        status:  isPresent ? 'present' : 'not set',
        isPresent,
        time: new Date().toTimeString()
    };

    if(!this.dates[date[2]]) this.dates[date[2]] = {};
    if(!this.dates[date[2]][date[1]]) this.dates[date[2]][date[1]] = {};
    this.dates[date[2]][date[1]][date[0]] = isPresent;
}


const attendenceModel = mongoose.models.attendence ||  mongoose.model('attendence', attendenceSchema);

export default attendenceModel;