import jwt from 'jsonwebtoken';
import wardenModel from '../Models/wardenModel';
import alertMsg from '@/Functions/alertMsg';


export default async function verifyWardenToken(req, res, next){
    
    let token = req.headers['authorization'];
    if(!(token && token.split(' ')[1])) return res.status(401).json({alert: alertMsg('no-token'), miss: false});
    if(token.split(' ')[0] !== 'Bearer') return res.status(401).json({alert: alertMsg('invalid-token'), miss: false});
    token = token.split(' ')[1];

    try{
        let wardenId = (jwt.verify(token, process.env.JWT_KEY)).id;
        let warden = await wardenModel.findById(wardenId);

        if(!warden) return res.json({alert: alertMsg('invalid-token'), miss: false});
        req.warden = warden;
        return next(req, res);
    } catch(error){
        return res.status(401).json({alert: alertMsg('invalid-token'), miss: false, error});
    }
}