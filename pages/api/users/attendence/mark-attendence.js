import connetToDb from "../../Middlewares/connectToDb";
import verifyUserToken from "../../Middlewares/verifyUserToken";
import attendenceModel from "../../Models/attendenceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.json({msg: 'Method not allowed', miss: false});

    let time = new Date().toTimeString().split(' ')[0].split(':');
    if(!(time[0] < 20 && time[0] > 21)) return res.json({status: 'error', msg: 'You can only mark your attendence between 20:00 to 21:00', miss: false});

    if(!req.user) return res.json({status: 'error', msg: 'Token is not valid', miss: false});
    let user = req.user;
    let date = new Date().toLocaleDateString().split('/');

    try{
        let attendence = await attendenceModel.findOne({userId: user._id});
        if(!attendence) return res.json({status: 'error', msg: 'Attendence not found', miss: false});
        
        let attendenceStatus = attendence.status[date.join('/')]; 
        if(attendenceStatus && attendenceStatus.isPresent) return res.json({status: 'info', msg: 'Attendece is already marked.', miss: true, attendenceStatus: attendenceStatus.status})

        let ip = await fetch('https://api.ipify.org?format=json');
        ip = await ip.json();

        if(ip != process.env.HOSTEL_IP) return res.json({status: 'error', msg: 'You are not connected to hostel WiFi.', miss: false});

        attendence.markAttendence(ip);
        await attendence.save();

        return res.json({status: 'success', msg: 'Attendence marked', miss: true, attendenceStatus: 'present'});
    } catch(error){
        console.log(error);
        return res.status(401).json({status: 'error', msg: 'Internal server error.', miss: false, error});
    }
}

const next01 = (req, res) => verifyUserToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);