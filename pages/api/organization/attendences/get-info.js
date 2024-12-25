import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../../Middlewares/connectToDb";
import verifyOrganizationToken from "../../Middlewares/verifyOrganizationToken";
import attendenceModel from "../../Models/attendenceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.status(401).json({alert: alertMsg('invalid-req-method'), miss: false});

    let {query} = req
    let {id, mounth, year} = query

    year = year || new Date().getFullYear();
    mounth = mounth || new Date().getMonth() + 1;

    if(!id) return res.status(201).json({alert: alertMsg('incomplite-info'), miss: false});

    try{
        var attendence = await attendenceModel.findById(id);
        
        let attendenceInfo = {}
        
        attendenceInfo['attendenceStatus'] = attendence.getAttendenceStatus({mounth, year});
        attendenceInfo['presentDays'] = attendence.getPresentDays({mounth, year});

        return res.status(200).json({alert: {type: 'success', msg: 'Attendence finde successfully.'}, miss: true, attendenceInfo});
    } catch(e){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false})
    }
}


const next01 = (req, res) => verifyOrganizationToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);