import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../Middlewares/connectToDb";
import organizationModel from "../Models/organizationModel";

async function next(req, res){
    if(req.method != "POST") return res.status(400).json({alert: alertMsg('invalid-req-method'), miss: false});

    let {name, username, password, organizationNo} = req.body;
    if(!(name && username && password && organizationNo)) return res.status(204).json({alert: alertMsg('incomplite-info'), miss: false});
    username = username.split(' ');

    if(username[1] != process.env.ORGANIZATION_USERNAME_KEY) return res.status(401).json({alert: alertMsg('invalid-info')});
    username = username[0];

    try{
        let organization = await organizationModel.findOne({username});
        if(organization) return res.status(400).json({alert: {type: 'info', msg: 'username is already use by other please select another username.'}, miss: false});

        organization = await organizationModel.create({
            name, username,
            password: organizationModel.createHash(password),
            organizationNo
        });

        let token = organization.createToken();

        organization = organization.toObject();
        delete organization.password

        return res.status(200).json({alert: {type: 'success', msg: 'Account is created for your organization.'}, miss: true, token, organization});
    } catch(error){
        return res.status(500).json({alert: alertMsg('internal-server-error'), miss: false})
    }
}

export default (req, res) => connetToDb(req, res, next);