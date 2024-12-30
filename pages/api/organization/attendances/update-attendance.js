import verifyWardenToken from "../../Middlewares/verifyOrganizationToken";
import connetToDb from "../../Middlewares/connectToDb";
import alertMsg from "@/Functions/alertMsg";
import attendanceModel from "../../Models/attendanceModel";


async function next(req, res) {
    if(req.method != 'POST') return res.json({alert: alertMsg('invalid-req-method'), miss: false});

    let {time, attendanceInfo} = req.body;
    if(!(time && attendanceInfo && time[0] && time[1] && time[2])) return res.json({alert: alertMsg('incomplite-info'), miss: false});

    time = time.map(e => String(e))

    let {organization} = req; 
    try{
        let attendances = await attendanceModel.find({organizationId: organization._id});
        
        let temp = attendances.map(async (attendance) => attendance.markAttendance(attendanceInfo[attendance._id] == 'present', time));
        await Promise.all(temp);

        return res.json({alert: {type: 'success', msg: 'All attendance are updated.'}, miss: true});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), miss: false});
    }
}


const next01 = (req, res) => verifyWardenToken(req, res, next)

export default (req, res) => connetToDb(req, res, next01);