import jwt from 'jsonwebtoken'
import organizationModel from '../Models/organizationModel';
import connetToDb from '../Middlewares/connectToDb';
import alertMsg from '@/Functions/alertMsg';


async function next(req, res){
    if(req.method != 'GET') return res.json({alert: alertMsg('invalid-req-method'), miss: false});
    let token = req.headers['authorization']

    if(!(token && token.split(' ')[1])) return res.status(401).json({alert: alertMsg('no-token'), miss: false});
    if(token.split(' ')[0] !== 'Bearer') return res.status(401).json({alert: alertMsg('invalid-token'), miss: false});
    token = token.split(' ')[1]
    try{
        let organizationId = jwt.verify(token, process.env.JWT_KEY).id;

        let organization = await organizationModel.findById(organizationId);
        if(!organization) return res.json({alert: alertMsg('invalid-token'), miss: false});

        return res.json({alert: {type: 'success', msg: 'Token is valid'}, miss: true, organization});
    } catch(error){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false, error});
    }
}

export default (req, res) => connetToDb(req, res, next)