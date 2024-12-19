import mongoose from 'mongoose';

const attendenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: Boolean,
        default: false,
        time: {
            type: Date,
            default: Date.now
        }
    }
});

const attendenceModel = mongoose.models.attendence ||  mongoose.model('attendence', attendenceSchema);

export default attendenceModel;