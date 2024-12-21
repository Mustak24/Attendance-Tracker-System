import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../Middlewares/connectToDb";
import wardenModel from "../Models/wardenModel";


async function next(req, res) {
    let {username, password} = req.body;

    if(!(username && password)) return res.json({alert: alertMsg('incomplite-info'), miss: false});
    try{    
        let warden = await wardenModel.findOne({username}).select({password: true});
        if(!(warden && warden.comparePassword(password))) return res.json({alert: alertMsg('invalid-info'), miss: false});

        let token = warden.createToken();
        return res.json({alert: {type: 'success', msg: 'login successfully'}, token, miss: true});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), error, miss: false})
    }
}



export default (req, res) => connetToDb(req, res, next);