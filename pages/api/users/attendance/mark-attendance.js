import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyUserToken from "../../Middlewares/verifyUserToken";
import attendanceModel from "../../Models/attendanceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.json({msg: 'Method not allowed', miss: false});

    let time = new Date().toTimeString().split(' ')[0].split(':');

    if(time[0] > 21) return res.json({alert: {type: 'error', msg: 'You are leat attendance time is 20:00 to 21:59.'}});
    if(time[0] < 20) return res.json({alert: {type: 'error', msg: 'You can only mark your attendance after 19:59'}, miss: false});

    let user = req.user;
    let date = new Date().toLocaleDateString().split('/');

    try{
        let attendance = await attendanceModel.findOne({userId: user._id});
        if(!attendance) return res.json({alert: {type: 'error', msg: 'Attendance not found'}, miss: false});
        
        let attendanceStatus = attendance.status.get(date.join('/'));

        if(attendanceStatus == 'present') return res.json({alert: {type: 'info', msg: 'Attendace is already marked.'}, miss: true, attendanceStatus})

        let ip = await fetch('https://api.ipify.org');
        ip = await ip.text();
        if(ip != process.env.ORGANIZATION_IP) return res.json({alert: {type: 'error', msg: 'You are not connected to organization WiFi.'}, miss: false});

        await attendance.markAttendance(true);

        return res.json({alert: {type: 'success', msg: 'Attendance marked'}, miss: true, attendanceStatus: 'present'});
    } catch(error){
        console.log(error)
        return res.status(401).json({alert: alertMsg('internal-server-error'), miss: false, error});
    }
}

const next01 = (req, res) => verifyUserToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);