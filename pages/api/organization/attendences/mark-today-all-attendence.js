import verifyorganizationToken from "../../Middlewares/verifyOrganizationToken";
import connetToDb from "../../Middlewares/connectToDb";
import alertMsg from "@/Functions/alertMsg";
import attendenceModel from "../../Models/attendenceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.status(401).json({alert: alertMsg('invalid-req-method'), miss: false});

    let time = new Date();
    if(time.toTimeString().split(':')[0] < 21) return res.status(501).json({alert: {type: 'info', msg: 'Defaul attendence time still left.'}, miss: false});

    let {organization} = req;
    
    try{
        let attendences = await attendenceModel.find({organizationId: organization._id});
        for(let attendance of attendences){
            if(attendance.status.get(time.toLocaleDateString()) != 'present'){
                await attendance.markAttendence(false);
            }
        }
        return res.status(200).json({alert: {type: 'success', msg: 'All attendence are updated.'}, miss: true});
    } catch(error){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false});
    }
}


const next01 = (req, res) => verifyorganizationToken(req, res, next)

export default (req, res) => connetToDb(req, res, next01);