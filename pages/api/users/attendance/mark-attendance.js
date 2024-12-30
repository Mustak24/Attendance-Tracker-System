import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyUserToken from "../../Middlewares/verifyUserToken";
import attendanceModel from "../../Models/attendanceModel";
import organizationModel from "../../Models/organizationModel";


async function next(req, res) {
    if(req.method != 'GET') return res.json({msg: 'Method not allowed', miss: false});

    let time = new Date().toTimeString().split(' ')[0].split(':');

    let user = req.user;
    let date = new Date().toLocaleDateString().split('/');

    try{
        let {attendanceTime} = await organizationModel.findById(user.organizationId);
        let {hr, min} = attendanceTime
        
        if(time[0] > hr) return res.json({alert: {type: 'error', msg: `You are too leat attendance time is left { ${hr}:${min} to ${hr+1}:${min} }.`}, miss: false});
        if(time[0] < hr) return res.json({alert: {type: 'error', msg: `You can only mark your attendance before ${hr}:${min}`}, miss: false});


        let attendance = await attendanceModel.findOne({userId: user._id});
        if(!attendance) return res.json({alert: {type: 'error', msg: 'Attendance not found'}, miss: false});
        
        let attendanceStatus = attendance.status.get(date.join('/'));

        if(attendanceStatus) return res.json({alert: {type: 'info', msg: 'Attendace is already marked.'}, miss: true, attendanceStatus})


        if(!(await attendance.isValidIp())) return res.json({alert: {type: 'error', msg: 'Your connection in not authorize.'}, miss: false});

        await attendance.markAttendance(true);

        return res.json({alert: {type: 'success', msg: 'Attendance marked'}, miss: true, attendanceStatus: 'present'});
    } catch(error){
        console.log(error)
        return res.json({alert: alertMsg('internal-server-error'), miss: false, error});
    }
}

const next01 = (req, res) => verifyUserToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);