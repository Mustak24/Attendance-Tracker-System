import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyWardenToken from "../../Middlewares/verifyWardenToken";
import userModel from "../../Models/userModel";


async function next(req, res) {
    if(req.method != 'GET') return res.status(401).json({alert: alertMsg('invalid-req-method'), miss: false});
    let {warden} = req;
    
    try{
        let usersInfo = await userModel.find({wardenId: warden._id});
        return res.status(200).json({alert: {type: 'success', msg: 'Attendence finde successfully.'}, miss: true, usersInfo});
    } catch(e){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false})
    }
    
}


const next01 = (req, res) => verifyWardenToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);