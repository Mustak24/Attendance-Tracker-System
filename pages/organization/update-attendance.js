import Button from "@/Components/Button";
import Hr from "@/Components/Hr";
import ShowIf, { ShowIfElse } from "@/Components/ShowIf";
import { _AppContext } from "@/Contexts/AppContext";
import { isNumber } from "@/Functions/miniFuntions";
import getAttendanceInfo from "@/Functions/organization/getAttendanceInfo";
import getUsersInfo from "@/Functions/organization/getUsersInfo";
import updateAttendance from "@/Functions/organization/updateAttendace";
import verifyOrganizationToken from "@/Functions/organization/verifyOrganizationToken";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { LuCalendarClock } from "react-icons/lu";
import { TbCalendarClock } from "react-icons/tb";

export default function UpdateAttendance(){

    const {setAlert} = useContext(_AppContext)

    const router = useRouter()

    const [isLoad, setLoad] = useState(false);
    const [year, setYear] = useState('');
    const [mounth, setMounth] = useState('');
    const [date, setDate] = useState('');
    const [usersInfo, setUsersInfo] = useState([]);
    const [updateInfo, setUpdateInfo] = useState(0);

    const attendaceForm = useRef(null);


    async function verify(){
        let {miss} = await verifyOrganizationToken(localStorage.getItem('organization-token'));
        if(!miss) return router.push('/');
        
        setLoad(true);
        return handleGetUsersInfo();
    }

    async function handleGetUsersInfo(){
        let {miss, usersInfo} = await getUsersInfo(localStorage.getItem('organization-token'));
        if(miss) return setUsersInfo(usersInfo);
    }

    useEffect(() => {
        let time = new Date();
        setDate(String(time.getDate()));
        setMounth(String(time.getMonth() + 1));
        setYear(String(time.getFullYear()));

        verify();
    }, []);


    async function hendalForm(){
        let formData = Object.fromEntries(new FormData(attendaceForm.current));
        let time = [date, mounth, year];

        let {miss, alert} = await updateAttendance(localStorage.getItem('organization-token'), formData, time);
        setAlert((alerts) => [...alerts, alert]);

        if(miss) return router.push('/organization')
    }

    return (<>
        <div className="w-full h-screen overflow-x-hidden py-5 px-2 sm:p-10 pb-10">
            <ShowIf when={isLoad} isLoading={true}>
                <div className="text-2xl font-bold font-sans">Attendance Update Form</div>
                <Hr/>
                <form ref={attendaceForm} onSubmit={hendalForm}>
                    <div className="flex flex-col gap-1 w-fit mb-10">    
                        <div className="text-sm flex gap-2 items-center">
                            <div className="relative text-sm self-end flex items-center gap-2">
                                <TbCalendarClock className="size-5" />
                            </div>
                            <div className="w-8 relative flex items-center justify-center border-b-2 border-black">
                                <input 
                                    value={date} 
                                    type="text" 
                                    maxLength={2}
                                    className="w-full text-center outline-none bg-transparent border-none" 
                                    onBlur={(e) => setDate((date) => date > 1 ? String(date).padStart(2, '0') : '01')}
                                    onChange={(e) => {
                                        let {value} = e.target
                                        if(!isNumber(value)) return;
                                        let maxDate = new Date(year, mounth+1, 0).getDate();
                                        setDate(value >= maxDate ? maxDate : value);
                                    }}
                                />
                            </div>
                            <div className="w-8 relative flex items-center border-b-2 border-black">
                                <input 
                                    value={mounth} 
                                    type="text" 
                                    maxLength={2}
                                    className="w-full text-center outline-none bg-transparent border-none" 
                                    onBlur={(e) => setMounth((mounth) => mounth > 1 ? mounth.padStart(2, '0') : '01')}
                                    onChange={(e) => {
                                        let {value} = e.target
                                        if(!isNumber(value)) return;
                                        setMounth(value > 12 ? '12' : value);
                                    }}
                                />
                            </div>
                            <div className="w-12 relative flex items-center border-b-2 border-black"> 
                                <input 
                                    value={year} 
                                    type="text" 
                                    maxLength={4} 
                                    className="w-full text-center outline-none bg-transparent border-none" 
                                    onBlur={(e) => {
                                        if(e.target.value < 2005) return setYear(new Date().getFullYear())
                                    }}
                                    onChange={(e) => {
                                        let {value} = e.target;
                                        if(!isNumber(value)) return;
                                        let nowYear = new Date().getFullYear();
                                        setYear(value < nowYear ? value : nowYear)
                                    }}
                                />
                            </div>
                            <button 
                                className="relative ml-1 font-sans text-[13px] border-2 border-black font-semibold opacity-90 sm:hover:bg-black sm:hover:text-white transition-all active:bg-black active:text-white px-2 rounded-md py-1 animate-bounce h-6 top-[6px] whitespace-nowrap flex items-center gap-1"
                                onClick={() => setUpdateInfo((updateInfo) => updateInfo + 1)}
                            >
                                Set <LuCalendarClock/>
                            </button>
                        </div>
                        <div className="text-xs font-mono">{'( DD / MM / YYYY )'}</div>
                        <Hr className="my-0 h-[2px]"/>
                    </div>

                    <div className="flex flex-col ">
                        {
                            usersInfo.map((user, index) => {
                                return (
                                    <AttendaceRow
                                        key={index}
                                        index={index+1}
                                        name={user.name}
                                        roomNo={user.roomNo}
                                        attendanceId={user.attendanceId}
                                        mounth={mounth}
                                        year={year}
                                        date={date}
                                        updateInfo={updateInfo}
                                    />
                                    )
                                })
                            }
                    </div>
                </form>

                <div className="text-xs fixed bottom-2 left-2 sm:left-10">
                    <Button onClick={hendalForm}>Update</Button>
                </div>   
            </ShowIf>
        </div>
        
    </>)
}


function AttendaceRow({index, name, roomNo, attendanceId, mounth, year, date, updateInfo}){

    const [presentDays, setPresentDays] = useState([]);;
    const [isUpdate, setUpdate] = useState(false);
    const [isPresent, setIsPresent] = useState(null);

    async function hendalAttendanceInfo() { 
        if(isUpdate) return;

        setUpdate(true);
        let {miss, attendanceInfo} = await getAttendanceInfo(
                localStorage.getItem('organization-token'), 
                attendanceId, 
                mounth, 
                year
        );

        setUpdate(false);
        if(!miss) return;

        setPresentDays(attendanceInfo?.presentDays);
        return hendalIsPresent();
    }

    function hendalIsPresent(){
        for(let i=0; i<presentDays.length; i++){
            if(presentDays[i] == date) {
                return setIsPresent(true);
            }
        }
        return setIsPresent(false);
    }

    useEffect(() => {
        hendalIsPresent()
    }, [date, presentDays]);

    useEffect(() => {
        hendalAttendanceInfo();
    }, [updateInfo])

    return <>
        <div className="user-attendance w-full mb-3 cursor-default" style={{animation: 'animate-opacity-0-to-1 .5s'}}>
            <div className="w-full flex text-sm sm:gap-5 gap-2 pl-2">
                <div className="flex gap-2 sm:gap-1 max-sm:flex-col text-xs">
                    <div>
                        <div className="min-w-10 flex items-center">{index} .</div>
                        <Hr className="h-[1px] my-[0px]"/>
                    </div>
                    <div>
                        <div className="relative min-w-24 flex items-center group">
                            <ShowIfElse when={name.length > 10} Else={name}>
                                {name.slice(0,10)} ...
                                <div className="absolute whitespace-nowrap bottom-full left-2  px-2 py-1 rounded-md max-w-[200px] bg-black opacity-70 hidden group-hover:flex">{name}</div>
                            </ShowIfElse>
                        </div>
                        <Hr className="h-[1px] my-[0px]"/>
                    </div>
                    <div>
                        <div className="min-w-16 flex items-center">{roomNo}</div>
                        <Hr className="h-[1px] my-[0px]"/>
                    </div>
                </div>
                <label htmlFor={attendanceId} className="days w-full flex items-center self-start max-sm:ml-5">  
                    <div 
                        className="flex items-center text-white font-sans font-semibold gap-4 rounded-md w-fit px-2 h-6"
                        style={{
                            backgroundColor: isPresent ? 'rgb(0,255,0,.8)' : 'rgb(255,0,0,.8)', 
                            transition: 'all .2s'
                        }}
                    >
                        <div className="relative w-16 flex items-center">
                            <div className="absolute" style={{
                                opacity: isPresent ? 1 : 0,
                                scale: isPresent ? 1 : 0,
                                transition: 'all .2s',
                            }}>Present</div>

                            <div className="absolute" style={{
                                opacity: !isPresent ? 1 : 0,
                                scale: !isPresent ? 1 : 0,
                                transition: 'all .2s',
                            }}>Absent</div>
                        </div>

                        <input 
                            id={attendanceId}
                            type="checkbox" 
                            checked={isPresent}
                            onChange={() => setIsPresent(() => !isPresent)}
                        />

                        <input hidden name={attendanceId} value={isPresent ? 'present' : 'absent'}/>
                    </div>
                </label>
            </div>
            <Hr className="h-1 my-1 w-full"/>
        </div>
    </>
}