
import organizationModel from '../Models/organizationModel';
import alertMsg from '@/Functions/alertMsg';


export default async function verifyOrganizationToken(req, res, next){
    
    let token = req.headers['authorization'];
    if(!(token && token.split(' ')[1])) return res.json({alert: alertMsg('no-token'), miss: false});
    if(token.split(' ')[0] !== 'Bearer') return res.json({alert: alertMsg('invalid-token'), miss: false});
    token = token.split(' ')[1];

    try{
        let organization = await organizationModel.isValidToken(token);
        req.organization = organization;
        return next(req, res);
    } catch(error){
        return res.json({alert: alertMsg('invalid-token'), miss: false, error});
    }
}