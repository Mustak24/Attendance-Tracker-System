import verifyorganizationToken from "../../Middlewares/verifyOrganizationToken";
import connetToDb from "../../Middlewares/connectToDb";
import alertMsg from "@/Functions/alertMsg";
import attendanceModel from "../../Models/attendanceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.json({alert: alertMsg('invalid-req-method'), miss: false});

    let Time = new Date();
    let date = [Time.getDate(), Time.getMonth()+1, Time.getFullYear()].join('/')

    let {organization} = req;
    let {time, duration} = organization.attendanceTime;

    time = time.split(':').map(Number)
    let attendanceTime = time[0] + time[1]/60

    if((Time.getHours + Time.getMinutes/60) < attendanceTime + duration) return res.json({alert: {type: 'info', msg: 'Defaul attendance time still left.'}, miss: false});
    
    try{
        let attendances = await attendanceModel.find({organizationId: organization._id});
        for(let attendance of attendances){
            if(attendance.status.get(date) != 'present'){
                await attendance.markAttendance(false);
            }
        }
        return res.json({alert: {type: 'success', msg: 'All attendance are updated.'}, miss: true});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), miss: false});
    }
}


const next01 = (req, res) => verifyorganizationToken(req, res, next)

export default (req, res) => connetToDb(req, res, next01);