import Button from "@/Components/Button";
import Hr from "@/Components/Hr";
import { Popover, PopoverOnHover } from "@/Components/Popover";
import ShowIf, { ShowIfElse } from "@/Components/ShowIf";
import { _AppContext } from "@/Contexts/AppContext";
import markAllAttendance from "@/Functions/organization/markAllAttendance";
import { isNumber } from "@/Functions/miniFuntions";
import getUsersInfo from "@/Functions/organization/getUsersInfo";
import verifyOrganizationToken from "@/Functions/organization/verifyOrganizationToken";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { LuCalendarClock, LuUserRoundPlus } from "react-icons/lu";
import getAttendanceInfo from "@/Functions/organization/getAttendanceInfo";
import { MdOutlineDownloadForOffline } from "react-icons/md";

export default function Index(){

    const {setAlert} = useContext(_AppContext)

    const router = useRouter()

    const [isLoad, setLoad] = useState(false)
    const [usersInfo, setUsersInfo] = useState([])
    const [organizationInfo, setOrganizationInfo] = useState({})
    const [updateInfo, setUpdateInfo] = useState(0)
    const [year, setYear] = useState('');
    const [mounth, setMounth] = useState('');
    const [isCsvDownloading, setCsvDownloading] = useState(false);


    async function handleGetUsersInfo(){
        let {miss, usersInfo} = await getUsersInfo(localStorage.getItem('organization-token'));
        if(miss) return setUsersInfo(usersInfo);
    }

    async function verify() {        
        let token = localStorage.getItem('organization-token');
        let {miss, organization} = await verifyOrganizationToken(token);
        if(!miss) return router.push('/');  

        setOrganizationInfo(organization);
        setLoad(true)

        await markAllAttendance(token)
        handleGetUsersInfo();
    }

    useEffect(() => {
        if(organizationInfo.name && router.query['organization-name'] != organizationInfo.name){
            router.push(`/organization/${organizationInfo.name}`)
        }
    }, [router.query, organizationInfo]);

    useEffect(() => {
        let time = new Date()
        setYear(String(time.getFullYear()));
        setMounth(String(parseInt(time.getMonth()) + 1));

        verify();
    }, [])



    function handleLogout(){
        localStorage.removeItem('organization-token');
        router.push('/');
    }

    async function downloadData() {
        setCsvDownloading(true)
        let res = await fetch(`${window.location.origin}/api/download/attendance?mounth=${mounth}&year=${year}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('organization-token')}`
            }
        });
        res = await res.blob();

        let url = URL.createObjectURL(res);

        let a = document.createElement('a');

        a.href = url;
        a.download = `attendance_${year}_${mounth}.csv`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        setCsvDownloading(false);
    }



    return (
        <div className="w-full h-screen overflow-x-hidden py-5 px-2 sm:p-10  ">
            <ShowIf when={isLoad} isLoading={true}>
                <div className="text-2xl font-semibold w-full flex flex-col gap-4">
                    <div className="flex gap-5 sm:gap-10">
                        <div>
                            <div>Hey,</div>
                            <div className="text-5xl capitalize">{
                                (organizationInfo?.name || '').length < 10 ? 
                                    organizationInfo.name
                                    : organizationInfo.name.slice(0,10) + '...'
                            }</div>
                        </div>
                        <div className="text-xs self-end">
                            <Button onClick={() => router.push('/organization/create-user')}>
                                <div className="flex gap-2 items-center">
                                    <LuUserRoundPlus className="size-4" /> User
                                </div>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-5 items-center">
                        <div className="text-xs">
                            <Button text="royalblue" onClick={() => router.push('/organization/update-attendance')}>Update Attendance</Button>
                        </div>
                        <div className="text-xs">
                            <Button text="crimson" onClick={downloadData} isLoading={isCsvDownloading}>
                                <div className="flex w-fit gap-2 items-center">
                                    <MdOutlineDownloadForOffline className="size-5" />
                                    CSV File
                                </div>
                            </Button>
                        </div>
                    </div>
                    <Hr/>
                </div>

                <main className="flex flex-col overflow-y-scroll">
                    <div className="flex gap-5 px-2 sm:px-3 mb-2">
                        <div className="max-sm:text-sm font-sans border-b-black border-b-2 px-2 text-center box-content">Attendace Table</div>
                        <div className="text-sm flex gap-2 items-center">
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
                            <div className="w-8 relative flex items-center border-b-2 border-black">
                                <input 
                                    value={mounth} 
                                    type="text" 
                                    maxLength={2}
                                    className="w-full text-center outline-none bg-transparent border-none" 
                                    onBlur={() => setMounth((mounth) => mounth > 1 ? mounth.padStart(2, '0') : '01')}
                                    onChange={(e) => {
                                        let {value} = e.target
                                        if(!isNumber(value)) return;
                                        setMounth(value > 12 ? '12' : value);
                                    }}
                                />
                            </div>
                            <button 
                                className="relative ml-1 font-sans text-[13px] border-2 border-black font-semibold opacity-90 sm:hover:bg-black sm:hover:text-white transition-all active:bg-black active:text-white px-2 rounded-md py-1 animate-bounce h-6 top-[6px] whitespace-nowrap flex items-center gap-1"
                                onClick={() =>{ 
                                    setAlert((alerts) => [...alerts, {type: 'info', msg: `Attendance Table date is ${year}/${mounth}`}])
                                    setUpdateInfo((updateInfo) => updateInfo + 1);
                                }}
                            >
                                Set <LuCalendarClock/>
                            </button>
                        </div>
                    </div>
                    <div className="w-full h-fil borde-2 rounded-md py-5 sm:px-1">
                        {
                            usersInfo.map((userInfo, index) => {
                                return <AttendaceRow 
                                            key={index} 
                                            index={index+1} 
                                            name={userInfo.name} 
                                            roomNo={userInfo.roomNo} 
                                            attendanceId={userInfo.attendanceId}
                                            mounth={mounth}
                                            year={year}
                                            updateInfo={updateInfo}
                                        />
                            })
                        }
                    </div>
                </main>
                <button className="fixed top-2 right-2 text-4xl  group" onClick={handleLogout}>
                    <PopoverOnHover>
                        <HiOutlineLogout className="group-active:scale-90" />
                        <Popover className={'text-xs right-3 font-mono rounded-md bg-[rgb(255,255,255,.5)] py-1 px-3 max-sm:hidden'}>Logout</Popover>
                    </PopoverOnHover>
                </button>
                <div className="text-xs fixed bottom-2 left-2">
                    <Button text="royalblue" onClick={() => router.push('/organization/update-info')}>Update Info</Button>
                </div>
            </ShowIf>
        </div>
    )
}


function AttendaceRow({index, name, roomNo, attendanceId, mounth, year, updateInfo}){

    const [presentDays, setPresentDays] = useState([]);
    const [attendanceStatus, setAttendanceStatus] = useState([]);
    const [isUpdate, setUpdate] = useState(false);

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

        setPresentDays(attendanceInfo?.presentDays)
        setAttendanceStatus(attendanceInfo?.attendanceStatus)
    }

    useEffect(() => {
        hendalAttendanceInfo();
    }, [updateInfo])

    return <>
        <div className="user-attendance w-full mb-3 cursor-default" style={{animation: 'animate-opacity-0-to-1 .5s'}}>
            <div className="w-full flex text-sm sm:gap-5 gap-0 pl-2">
                <div className="flex gap-2 sm:gap-1 max-sm:flex-col text-xs">
                    <div>
                        <div className="min-w-10 flex items-center">{index} .</div>
                        <Hr className="h-[1px] my-[0px]"/>
                    </div>
                    <div>
                        <div className="relative min-w-24 flex items-center group capitalize">
                            <ShowIfElse when={name.length > 10} Else={name}>
                                {name.slice(0,10)} ...
                                <div className="absolute whitespace-nowrap bottom-full left-2  px-2 py-1 rounded-md max-w-[200px] bg-black opacity-70 hidden group-hover:flex text-white">{name}</div>
                            </ShowIfElse>
                        </div>
                        <Hr className="h-[1px] my-[0px]"/>
                    </div>
                    <div>
                        <div className="min-w-16 flex items-center">{roomNo}</div>
                        <Hr className="h-[1px] my-[0px]"/>
                    </div>
                </div>
                <div className="days w-full flex items-center gap-1 flex-wrap"> 
                    <div className="relative border-2 flex items-center rounded-md overflow-hidden justify-center h-6 px-2 font-mono font-semibold text-xs" style={{animationDelay: `${Math.random()*1000}ms`}}>TP:{presentDays.length}</div>
                    <div className="relative border-2 rounded-md overflow-hidden flex items-center justify-center gap-1 h-6 px-2 font-mono font-semibold text-xs" style={{animationDelay: `${Math.random()*1000}ms`}}>TA: {attendanceStatus.length - presentDays.length}</div>
                    {attendanceStatus.map(status => {
                        return (
                            <div 
                                key={status[0]} 
                                className="relative flex items-center justify-center rounded-[5px] opacity-0 border-none size-6 font-mono font-semibold text-white transition-all sm:hover:scale-75 sm:duration-100"
                                style={{
                                    backgroundColor: status[1] == 'present' ? 'rgb(0,255,0,.8)' : status[1] == 'absent' ? 'rgb(255,0,0,.8)' : 'rgb(0,0,0,.8)',
                                    animation: `animate-opacity-0-to-1 1s ${Math.random()}s forwards`
                                }}
                            >
                                {status[0]}
                            </div>
                        )
                    })}  
                </div>
            </div>
            <Hr className="h-1 my-1 w-full"/>
        </div>
    </>
}