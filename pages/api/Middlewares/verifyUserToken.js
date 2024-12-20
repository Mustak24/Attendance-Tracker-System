import jwt from 'jsonwebtoken';
import userModel from '../Models/userModel';


export default async function verifyUserToken(req, res, next){
    
    let token = req.headers['authorization'];
    if(!(token && token.split(' ')[1])) return res.status(401).json({status: 'error', msg: 'No token provided.', miss: false});
    if(token.split(' ')[0] !== 'Bearer') return res.status(401).json({status: 'error', msg: 'Token is not valid.', miss: false});
    token = token.split(' ')[1];

    try{
        let decode = jwt.verify(token, process.env.JWT_KEY);
        if(!(decode && decode.id)) return res.json({status: 'error',msg: 'Token is not valid', miss: false});
        let user = await userModel.findById(decode.id);
        if(!user) return res.json({status: 'error',msg: 'Token is not valid', miss: false});

        req.user = user;
        return next(req, res);
    } catch(error){
        console.log(error);
        return res.status(401).json({status: 'error', msg: 'Token is not valid.', miss: false, error});
    }
}