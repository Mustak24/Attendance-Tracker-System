import mongoose from 'mongoose';


const vaildTokenSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '7d' }
    }
});



const vaildTokenModel = mongoose.models.vaildToken || mongoose.model('vaildToken', vaildTokenSchema);

export default vaildTokenModel;