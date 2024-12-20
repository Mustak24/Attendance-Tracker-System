import jwt from 'jsonwebtoken'
import userModel from '../Models/userModel';
import connetToDb from '../Middlewares/connectToDb';


async function next(req, res){
    if(req.method != 'GET') return res.json({msg: 'Method not allowed', miss: false});
    let token = req.headers['authorization']

    if(!(token && token.split(' ')[1])) return res.status(401).json({status: 'error',msg: 'No token provided', miss: false});
    if(token.split(' ')[0] !== 'Bearer') return res.status(401).json({status: 'error',msg: 'Token is not valid', miss: false});
    token = token.split(' ')[1]
    try{
        let decode = jwt.verify(token, process.env.JWT_KEY);
        if(!(decode && decode.id)) return res.status(401).json({status: 'error',msg: 'Token is not valid', miss: false});

        let user = await userModel.findById(decode.id);
        if(!user) return res.json({status: 'error',msg: 'Token is not valid', miss: false});

        return res.json({status: 'success', msg: 'Token is valid', miss: true, user});
    } catch(error){
        return res.status(500).json({status: 'error',msg: 'Internal server error', miss: false, error});
    }
}

export default (req, res) => connetToDb(req, res, next)