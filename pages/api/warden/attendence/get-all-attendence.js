import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyWardenToken from "../../Middlewares/verifyWardenToken";
import userModel from "../../Models/userModel";
import attendenceModel from "../../Models/attendenceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.status(401).json({alert: alertMsg('invalid-req-method'), miss: false});

    let {warden, query} = req
    let year = query?.year || new Date().getFullYear();
    let mounth = query?.mounth || new Date().getMonth();
    try{
        let usersInfo = await userModel.find({wardenId: warden._id});

        for(let i=0; i<usersInfo.length; i++){
            let userAttendence = await attendenceModel.findOne({userId: usersInfo[i]._id});
            usersInfo.attendences = userAttendence.attendences[year][mounth];
            usersInfo.presentDays = userAttendence.getPresentDays({year, mounth});
        }

        return res.status(200).json({alert: {type: 'success', msg: 'Attendence finde successfully.'}, miss: false, usersInfo});
    } catch(e){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false})
    }
    
}


const next01 = (req, res) => verifyWardenToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);