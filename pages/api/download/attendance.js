import alertMsg from "@/Functions/alertMsg";
import connetToDb from "../Middlewares/connectToDb";
import verifyOrganizationToken from "../Middlewares/verifyOrganizationToken";
import attendanceModel from "../Models/attendanceModel";
import userModel from "../Models/userModel";
import { newArr } from "@/Functions/miniFuntions";


async function next(req, res){
    if(req.method != 'GET') return res.json({miss: false, alert: alertMsg('invalid-req-method')});
    let {organization} = req;
    let {mounth, year} = req.query;
    let time = new Date();
    year = year || time.getFullYear();
    mounth = mounth || time.getMonth();
    try{
        let days = new Date(year, mounth, 0).getDate();

        let csvArr = [
            ['Sr no.', 'Name', 'Room No', 'Days', ...newArr(days-1, ()=>''), 'Total present days'],
            ['', '', '', ...newArr(days, (_, i)=>i+1)]
        ]

        let attendances = await attendanceModel.find({organizationId: organization._id});
        let srNo = 1;
        for(let attendance of attendances){
            let userInfo = await userModel.findById(attendance.userId);
            let attendanceStatus = attendance.getAttendanceStatus({mounth, year}).map(e => e[1]);
            let totalPresent = attendance.getPresentDays({mounth, year}).length;
            csvArr.push([srNo++, userInfo.name, userInfo.roomNo, ...attendanceStatus, totalPresent]);
        }
        let csvData = csvArr.map(e => e.join(' ,')).join('\n');

        return res.send(csvData);
    } catch(error){
        console.log(error)
        return res.json({miss: false, alert: alertMsg('internal-server-error')}, error)
    }
}


const next01 = (req, res) => verifyOrganizationToken(req, res, next);

export default (req, res) => connetToDb(req, res, next01);