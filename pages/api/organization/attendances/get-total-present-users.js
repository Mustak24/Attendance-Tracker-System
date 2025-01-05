import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyOrganizationToken from "../../Middlewares/verifyOrganizationToken";
import attendanceModel from "../../Models/attendanceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.json({miss: false, alert: alertMsg('invalid-req-method')});
    let {organization} = req;
    let {date} = req.query;

    if(!date) return res.json({miss: false, alert: alertMsg('incomplit-info')});
    try{
        let totalPresentUsers = await attendanceModel.getTotalPresentUsers(organization._id, date);
        return res.json({miss: true, totalPresentUsers});
    } catch(error){ 
        console.log(error)
        return res.json({miss: false, error, alert: alertMsg('internal-server-error')});
    }
}


const next01 = (req, res) => verifyOrganizationToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);