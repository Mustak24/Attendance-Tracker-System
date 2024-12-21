import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../Middlewares/connectToDb";
import wardenModel from "../Models/wardenModel";

async function next(req, res){
    if(req.method != "POST") return res.status(400).json({alert: alertMsg('invalid-req-method'), miss: false});

    let {name, username, password, hostelNo} = req.body;
    if(!(name && username && password && hostelNo)) return res.status(204).json({alert: alertMsg('incomplite-info'), miss: false});
    username = username.split(' ');

    if(username[1] != process.env.WARDEN_USERNAME_KEY) return res.status(401).json({alert: alertMsg('invalid-info')});
    username = username[0];

    try{
        let warden = await wardenModel.findOne({username});
        if(warden) return res.status(400).json({alert: {type: 'info', msg: 'username is already use by other please select another username.'}, miss: false});

        warden = await wardenModel.create({
            name, username,
            password: wardenModel.createHash(password),
            hostelNo
        });

        let token = warden.createToken();
        return res.status(200).json({alert: {type: 'success', msg: 'Your Warden account is created.'}, miss: true, token});
    } catch(error){
        console.log(error)
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false})
    }
}

export default (req, res) => connetToDb(req, res, next);