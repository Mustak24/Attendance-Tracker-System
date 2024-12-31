import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../Middlewares/connectToDb";
import organizationModel from "../Models/organizationModel";


async function next(req, res) {
    if(req.method != 'POST') return res.json({alert: alertMsg('invalid-req-method'), miss: false});
    
    let {username, password} = req.body;

    if(!(username && password)) return res.json({alert: alertMsg('incomplite-info'), miss: false});
    try{    
        let organization = await organizationModel.findOne({username}).select('+password');
        if(!(organization && organization.comparePassword(password))) return res.json({alert: alertMsg('invalid-info'), miss: false});

        let token = await organization.createToken();
        
        organization = organization.toObject();
        delete organization.password

        return res.json({alert: {type: 'success', msg: 'login successfully'}, token, miss: true, organization});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), error, miss: false})
    }
}



export default (req, res) => connetToDb(req, res, next);