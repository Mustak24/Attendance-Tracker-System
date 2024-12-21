import mongoose from 'mongoose';

export default async function connetToDb(req, res, next){
    if(mongoose.connections[0].readyState) return next(req, res);
    try{
        await mongoose.connect(process.env.MONGO_URL);
        return next(req, res);
    } catch(error){
        res.status(500).json({alert: {type: 'error', msg: 'Fail to connect to database'}, error, miss: false});
    }
}