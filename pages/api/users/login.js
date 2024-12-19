import connetToDb from "../Middlewares/connectToDb";
import userModel from "../Models/userModel";


async function next(req, res) {
    let {username, password} = req.body;
    if(!(username && password)) return res.json({status: 'warning', msg: 'Invalid infomation', miss: false});
    try{    
        let user = await userModel.findOne({username}).select({password: true});
        if(!(user && user.comparePassword(password))) return res.json({status: 'warning',msg: 'Invalid infomation', miss: false});

        let token = user.createToken();
        return res.json({status: 'success', miss: true, msg: 'login successfully', token});
    } catch(error){
        return res.json({status: 'error',msg: 'internal server error', error})
    }
}



export default (req, res) => connetToDb(req, res, next);