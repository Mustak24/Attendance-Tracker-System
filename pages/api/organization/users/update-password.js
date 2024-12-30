import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyOrganizationToken from "../../Middlewares/verifyOrganizationToken";
import userModel from "../../Models/userModel";

async function next(req, res) {
    if(req.method != 'POST') return res.json({alert: alertMsg('invalid-req-method'), miss: false});
    
    let {organization} = req;
    let {username, password} = req.body;
    if(!(username && password)) return res.json({alert: alertMsg('incomplit-info'), miss: false});

    try{
        let user = await userModel.findOneAndUpdate(
            {organizationId: organization._id, username}, 
            {password: await userModel.createHash(password)}
        );
        
        if(!user) return res.json({aler: {type: 'info', msg: 'No user found.'}, miss: true})

        return res.json({alert: {type: 'success', msg: 'Password will be updated.'}, miss: true});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), miss: false, error})
    }
}


const next01 = (req, res) => verifyOrganizationToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);