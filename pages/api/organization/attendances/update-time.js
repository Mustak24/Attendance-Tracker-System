import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyOrganizationToken from "../../Middlewares/verifyOrganizationToken";
import organizationModel from "../../Models/organizationModel";

async function next(req, res) {
    if(req.method != 'POST') return res.json({alert: alertMsg('invalid-req-method'), miss: false});
    
    let {organization} = req;
    let {time, duration} = req.body;
    if(!(time && duration)) return res.json({alert: alertMsg('incomplit-info'), miss: false});

    try{
        await organizationModel.findByIdAndUpdate(organization._id, {attendanceTime: {time, duration: duration/60}});
        return res.json({alert: {type: 'success', msg: 'Attendence time will be updated.'}, miss: true});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), miss: false, error})
    }
}


const next01 = (req, res) => verifyOrganizationToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);