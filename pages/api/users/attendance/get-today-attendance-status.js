import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyUserToken from "../../Middlewares/verifyUserToken";
import attendanceModel from "../../Models/attendanceModel";

async function next(req, res) {
    if(req.method != 'GET') return res.status(400).json({alert: alertMsg("invalid-req-method"), miss: false});

    let user = req.user;
    try{
        let attendance = await attendanceModel.findOne({userId: user._id});
        if(!attendance) return res.status(500).json({alert: {type: 'error', msg: 'Attendance not found'}, miss: false});
        
        let attendanceStatus = attendance.getTodayStatus();  
        return res.status(200).json({alert: {type: 'success', msg: 'Attendance status found.'}, miss: true, attendanceStatus});
    } catch(error){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false, error});
    }
}


const next01 = (req, res) => verifyUserToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);
