import connetToDb from "../../Middlewares/connectToDb";
import attendanceModel from "../../Models/attendanceModel";
import userModel from "../../Models/userModel";
import alertMsg from "@/Functions/alertMsg";
import verifyOrganizationToken from "../../Middlewares/verifyOrganizationToken";


async function next(req, res){
    
    if(req.method != 'POST') return res.json({alerrt: alertMsg('invalid-req-method'), miss: false});

    let {organization} = req

    let {username, password, name, mobileNo, roomNo} = req.body;
    if(!(username && password && name && mobileNo && roomNo)) return res.json({alert: alertMsg('incomplite-info'), miss: false});

    try{

        let user = await userModel.create({
            name, 
            username, 
            password: userModel.createHash(password), 
            mobileNo, 
            roomNo, 
            organizationNo: organization.organizationNo,
            organizationId: organization._id
        });
        let attendance = await attendanceModel.create({
            userId: user._id, 
            organizationId: organization._id,
        });
        user.attendanceId = attendance._id;
        await user.save();

        return res.json({alert: {type: 'success', msg: 'Successfully create accounte'}, miss: true});
    } catch(error){
        return res.json({alert: alertMsg('internal-server-error'), error, miss: false});
    }
}

const next01 = (req, res) => verifyOrganizationToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);