import verifyWardenToken from "../../Middlewares/verifyOrganizationToken";
import connetToDb from "../../Middlewares/connectToDb";
import alertMsg from "@/Functions/alertMsg";
import attendenceModel from "../../Models/attendenceModel";


async function next(req, res) {
    if(req.method != 'POST') return res.status(401).json({alert: alertMsg('invalid-req-method'), miss: false});

    let {time, attendanceInfo} = req.body;
    if(!(time && attendanceInfo && time[0] && time[1] && time[2])) return res.status(201).json({alert: alertMsg('incomplite-info'), miss: false});

    time = time.map(e => String(e))

    let {organization} = req; 
    try{
        let attendences = await attendenceModel.find({organizationId: organization._id});
        
        let temp = attendences.map(async (attendance) => attendance.markAttendence(attendanceInfo[attendance._id] == 'present', time));
        await Promise.all(temp);

        return res.status(200).json({alert: {type: 'success', msg: 'All attendence are updated.'}, miss: true});
    } catch(error){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false});
    }
}


const next01 = (req, res) => verifyWardenToken(req, res, next)

export default (req, res) => connetToDb(req, res, next01);