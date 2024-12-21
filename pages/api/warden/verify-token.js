import jwt from 'jsonwebtoken'
import wardenModel from '../Models/wardenModel';
import connetToDb from '../Middlewares/connectToDb';
import alertMsg from '@/Functions/alertMsg';


async function next(req, res){
    if(req.method != 'GET') return res.json({alert: alertMsg('invalid-req-method'), miss: false});
    let token = req.headers['authorization']

    if(!(token && token.split(' ')[1])) return res.status(401).json({alert: alertMsg('no-token'), miss: false});
    if(token.split(' ')[0] !== 'Bearer') return res.status(401).json({alert: alertMsg('invalid-token'), miss: false});
    token = token.split(' ')[1]
    try{
        let wardenId = jwt.verify(token, process.env.JWT_KEY).id;
        console.log(wardenId)
        let warden = await wardenModel.findById(wardenId);
        console.log(warden)
        if(!warden) return res.json({alert: alertMsg('invalid-token'), miss: false});

        return res.json({alert: {type: 'success', msg: 'Token is valid'}, miss: true, warden});
    } catch(error){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false, error});
    }
}

export default (req, res) => connetToDb(req, res, next)