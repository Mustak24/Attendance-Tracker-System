import verifyWardenToken from "../../Middlewares/verifyWardenToken";
import connetToDb from "../../Middlewares/connectToDb";
import alertMsg from "@/Functions/alertMsg";
import attendenceModel from "../../Models/attendenceModel";


async function next(req, res) {
    if(req.method != 'GET') return res.status(401).json({alert: alertMsg('invalid-req-method'), miss: false});

    let time = new Date();
    if(time.toTimeString().split(':')[0] < 21) return res.status(501).json({alert: {type: 'info', msg: 'Defaul attendence time still left.'}, miss: false});

    let {warden} = req;
    
    try{
        let attendences = await attendenceModel.find({wardenId: warden._id});
        attendences.forEach(async (attendence) => {
            if(!(attendence.status && attendence.status[time.toLocaleDateString()] == 'present')){
                attendence.markAttendence(false);
            }
            await attendence.save();
        })
        return res.status(200).json({alert: {type: 'success', msg: 'All attendence are updated.'}, miss: true});
    } catch(error){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false});
    }
}


const next01 = (req, res) => verifyWardenToken(req, res, next)

export default (req, res) => connetToDb(req, res, next01);