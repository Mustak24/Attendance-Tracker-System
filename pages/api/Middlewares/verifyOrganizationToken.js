import jwt from 'jsonwebtoken';
import organizationModel from '../Models/organizationModel';
import alertMsg from '@/Functions/alertMsg';


export default async function verifyOrganizationToken(req, res, next){
    
    let token = req.headers['authorization'];
    if(!(token && token.split(' ')[1])) return res.status(401).json({alert: alertMsg('no-token'), miss: false});
    if(token.split(' ')[0] !== 'Bearer') return res.status(401).json({alert: alertMsg('invalid-token'), miss: false});
    token = token.split(' ')[1];

    try{
        let organizationId = (jwt.verify(token, process.env.JWT_KEY)).id;
        let organization = await organizationModel.findById(organizationId);

        if(!organization) return res.json({alert: alertMsg('invalid-token'), miss: false});
        req.organization = organization;
        return next(req, res);
    } catch(error){
        return res.status(401).json({alert: alertMsg('invalid-token'), miss: false, error});
    }
}