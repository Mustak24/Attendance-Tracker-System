import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../Middlewares/connectToDb";
import organizationModel from "../Models/organizationModel";
import { getIp } from "@/Functions/miniFuntions";

async function next(req, res){
    if(req.method != "POST") return res.json({alert: alertMsg('invalid-req-method'), miss: false});

    let {name, username, password, organizationNo} = req.body;
    if(!(name && username && password && organizationNo)) return res.json({alert: alertMsg('incomplite-info'), miss: false});
    username = username.split(' ');

    if(!username[1] || username[1] != process.env.ORGANIZATION_USERNAME_KEY) return res.json({alert: alertMsg('invalid-info'), miss: false});
    username = username[0];

    try{
        let organization = await organizationModel.findOne({username});
        if(organization) return res.json({alert: {type: 'info', msg: 'username is already use by other please select another username.'}, miss: false});

        let ip = await getIp();

        organization = await organizationModel.create({
            name, username,
            password: organizationModel.createHash(password),
            organizationNo,
            ip
        }); 

        let token = organization.createToken();

        organization = organization.toObject();
        delete organization.password

        return res.json({alert: {type: 'success', msg: 'Account is created for your organization.'}, miss: true, token, organization});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), miss: false})
    }
}

export default (req, res) => connetToDb(req, res, next);