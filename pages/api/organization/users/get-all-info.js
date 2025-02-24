import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyOrganizationToken from "../../Middlewares/verifyOrganizationToken";
import userModel from "../../Models/userModel";


async function next(req, res) {
    if(req.method != 'GET') return res.json({alert: alertMsg('invalid-req-method'), miss: false});
    let {organization} = req;
    
    try{
        let usersInfo = await userModel.find({organizationId: organization._id});
        return res.json({alert: {type: 'success', msg: 'Attendence finde successfully.'}, miss: true, usersInfo});
    } catch(e){
        return res.json({alert: alertMsg('internal-server-error'), miss: false})
    }
    
}


const next01 = (req, res) => verifyOrganizationToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);