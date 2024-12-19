import connetToDb from "../Middlewares/connectToDb";
import attendenceModel from "../Models/attendenceModel";
import userModel from "../Models/userModel";
import jwt from 'jsonwebtoken';


async function next(req, res){
    
    if(req.method != 'POST') return res.json({msg: 'Method not allowed', miss: false});

    let token = req.headers.authorization;
    let {username, password, name, mobileNo, roomNo, hostelNo} = req.body;
    if(!token) return res.json({msg: 'No token provided'});
    if(!(username && password && name && mobileNo && roomNo && hostelNo)) return res.json({msg: 'Incomplite Infomation', miss: false});
    try{
        let {id} = jwt.verify(token, process.env.JWT_KEY);
       
        if(id != process.env.ADMIN_ID) return res.json({msg: 'Unauthorized token'});

        let user = await userModel.create({
            name, 
            username, 
            password: userModel.createHash(password), 
            mobileNo, 
            roomNo, 
            hostelNo
        });
        let attendence = await attendenceModel.create({userId: user._id});
        user.attendenceId = attendence._id;
        await user.save();

        return res.json({msg: 'Successfully create accounte', miss: true});
    } catch(e){
        console.log(e);
        return res.json({msg: 'Internal server error', error: e, miss: false});
    }
}


export default (req, res) => connetToDb(req, res, next);