import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../Middlewares/connectToDb";
import userModel from "../Models/userModel";


async function next(req, res) {
    let {username, password} = req.body;

    if(!(username && password)) return res.json({alert: alertMsg('incomplite-info'), miss: false});
    try{    
        let user = await userModel.findOne({username}).select('+password');
        if(!(user && user.comparePassword(password))) return res.json({alert: alertMsg('invalid-info'), miss: false});

        let token = user.createToken();

        user = user.toObject();
        delete user.password;

        return res.json({alert: {type: 'success', msg: 'login successfully'}, token, miss: true, user});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), error, miss: false})
    }
}



export default (req, res) => connetToDb(req, res, next);