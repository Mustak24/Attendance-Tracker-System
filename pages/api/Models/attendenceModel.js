import mongoose from 'mongoose';


const attendenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'organization'
    },
    attendences: {
        type: Map,
        of: {
            type: Map,
            of: {
                type: Map,
                of: Object
            }
        },
        default: new Map()
    },
    status: {
        type: Map,
        of: {
            type: String,
        },
        default: new Map()
    }
});

attendenceSchema.methods.markAttendence = async function(isPresent, date=null){
    date = date || new Date().toLocaleDateString().split('/');
    
    this.status.set(date.join('/'), isPresent ? 'present' : 'absent')

    if(!this.attendences.has(date[2])) this.attendences.set(date[2], new Map());

    if(!this.attendences.get(date[2]).has(date[1])) this.attendences.get(date[2]).set(date[1], new Map());

    this.attendences.get(date[2]).get(date[1]).set(date[0], {
        status: isPresent ? 'present' : 'absent',
        isPresent,
        time: new Date()
    });
    
    await this.save();
}

attendenceSchema.methods.getTodayStatus = function(){
    let date = new Date().toLocaleDateString();
    return this.status.get(date) || 'not mark';
}

attendenceSchema.methods.addProperty = function(key, value){
    this[key] = value;
}

attendenceSchema.methods.getAttendenceStatus = function({mounth, year}){
    year = year || new Date().getFullYear();
    mounth = mounth || new Date().getMonth() + 1;

    return Array.from({
        length: new Date(year, mounth, 0).getDate()
    }).map((_, index) => [index+1, this.status.get(`${index+1}/${mounth}/${year}`) || 'not mark'])
}


attendenceSchema.methods.getPresentDays = function({mounth=null, year=null}){
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


const attendenceModel = mongoose.models.attendence ||  mongoose.model('attendence', attendenceSchema);

export default attendenceModel;