import connetToDb from "../../Middlewares/connectToDb";
import verifyUserToken from "../../Middlewares/verifyUserToken";
import attendenceModel from "../../Models/attendenceModel";

async function next(req, res) {
    if(req.method != 'GET') return res.status(400).json({status: 'error', msg: 'Method not allowed', miss: false});
    if(!req.user) return res.status(401).json({status: 'error', msg: 'User not found.', miss: false});
    let user = req.user;
    try{
        let attendence = await attendenceModel.findOne({userId: user._id});
        if(!attendence) return res.status(500).json({status: 'error', msg: 'Attendence not found', miss: false});
        
        let date = new Date().toLocaleDateString();
        let attendenceStatus = attendence.status[date];
        return res.status(200).json({status: 'success', msg: 'Attendence status found.', miss: true, attendenceStatus});
    } catch(error){
        return res.status(500).json({status: 'error', msg: 'Internal server error.', miss: false, error});
    }
}


const next01 = (req, res) => verifyUserToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);
