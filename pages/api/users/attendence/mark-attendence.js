import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyUserToken from "../../Middlewares/verifyUserToken";
import attendenceModel from "../../Models/attendenceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.json({msg: 'Method not allowed', miss: false});

    let time = new Date().toTimeString().split(' ')[0].split(':');

    if(time[0] > 21) return res.json({alert: {type: 'error', msg: 'You are leat attendence time is 20:00 to 21:59.'}});
    if(time[0] < 20) return res.json({alert: {type: 'error', msg: 'You can only mark your attendence after 19:59'}, miss: false});

    let user = req.user;
    let date = new Date().toLocaleDateString().split('/');

    try{
        let attendence = await attendenceModel.findOne({userId: user._id});
        if(!attendence) return res.json({alert: {type: 'error', msg: 'Attendence not found'}, miss: false});
        
        attendence.status = attendence?.status || {};
        let attendenceStatus = attendence.status[date.join('/')];

        if(attendenceStatus && attendenceStatus != 'not mark') return res.json({alert: {type: 'info', msg: 'Attendece is already marked.'}, miss: true, attendenceStatus})

        let ip = await fetch('https://api.ipify.org');
        ip = await ip.text();
        if(ip != process.env.HOSTEL_IP) return res.json({alert: {type: 'error', msg: 'You are not connected to hostel WiFi.'}, miss: false});

        attendence.markAttendence(true);
        await attendence.save();

        return res.json({alert: {type: 'success', msg: 'Attendence marked'}, miss: true, attendenceStatus: 'present'});
    } catch(error){
        console.log(error)
        return res.status(401).json({alert: alertMsg('internal-server-error'), miss: false, error});
    }
}

const next01 = (req, res) => verifyUserToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);