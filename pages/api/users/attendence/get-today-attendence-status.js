import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyUserToken from "../../Middlewares/verifyUserToken";
import attendenceModel from "../../Models/attendenceModel";

async function next(req, res) {
    if(req.method != 'GET') return res.status(400).json({alert: alertMsg("invalid-req-method"), miss: false});

    let user = req.user;
    try{
        let attendence = await attendenceModel.findOne({userId: user._id});
        if(!attendence) return res.status(500).json({alert: {type: 'error', msg: 'Attendence not found'}, miss: false});
        
        let attendenceStatus = attendence.getTodayStatus();  
        return res.status(200).json({alert: {type: 'success', msg: 'Attendence status found.'}, miss: true, attendenceStatus});
    } catch(error){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false, error});
    }
}


const next01 = (req, res) => verifyUserToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);
