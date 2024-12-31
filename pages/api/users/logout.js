
import userModel from '../Models/userModel';
import connetToDb from '../Middlewares/connectToDb';
import alertMsg from '@/Functions/alertMsg';


async function next(req, res){
    if(req.method != 'GET') return res.json({alert: alertMsg('invalid-req-method'), miss: false});
    let token = req.headers['token']
    try{
        await userModel.removeToken(token);
        return res.json({alert: {type: 'success', msg: 'Logout successfully'}, miss: true});
    } catch(error){
        return res.status(500).json({alert: alertMsg('invalid-token'), miss: false, error});
    }
}

export default (req, res) => connetToDb(req, res, next);