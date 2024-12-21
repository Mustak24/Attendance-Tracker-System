import connetToDb from "../Middlewares/connectToDb";
import attendenceModel from "../Models/attendenceModel";
import userModel from "../Models/userModel";
import jwt from 'jsonwebtoken';
import wardenModel from "../Models/wardenModel";
import alertMsg from "@/Functions/alertMsg";
import verifyWardenToken from "../Middlewares/verifyWardenToken";


async function next(req, res){
    
    if(req.method != 'POST') return res.json({alerrt: alertMsg('invalid-req-method'), miss: false});

    let {warden} = req

    let {username, password, name, mobileNo, roomNo} = req.body;
    if(!(username && password && name && mobileNo && roomNo)) return res.json({alert: alertMsg('incomplite-info'), miss: false});

    try{
        let user = await userModel.create({
            name, 
            username, 
            password: userModel.createHash(password), 
            mobileNo, 
            roomNo, 
            hostelNo: warden.hostelNo,
            wardenId: warden._id
        });
        let attendence = await attendenceModel.create({userId: user._id});
        user.attendenceId = attendence._id;
        await user.save();

        return res.json({alert: {type: 'success', msg: 'Successfully create accounte'}, miss: true});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), error, miss: false});
    }
}

const next01 = (req, res) => verifyWardenToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);