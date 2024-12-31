
import userModel from '../Models/userModel';
import alertMsg from '@/Functions/alertMsg';


export default async function verifyUserToken(req, res, next){
    
    let token = req.headers['authorization'];
    if(!(token && token.split(' ')[1])) return res.json({alert: alertMsg('no-token'), miss: false});
    if(token.split(' ')[0] !== 'Bearer') return res.json({alert: alertMsg('invalid-token'), miss: false});
    token = token.split(' ')[1];

    try{
        let user = await userModel.isValidToken(token);
        req.user = user;
        
        return next(req, res);
    } catch(error){
        return res.json({alert: alertMsg('invalid-token'), miss: false, error});
    }
}