import Button from "@/Components/Button";
import Hr from "@/Components/Hr";
import { Popover, PopoverOnHover } from "@/Components/Popover";
import ShowIf, { ShowIfElse } from "@/Components/ShowIf";
import { _AppContext } from "@/Contexts/AppContext";
import markAllAttendence from "@/Functions/organization/markAllAttendence";
import { isNumber } from "@/Functions/miniFuntions";
import getUsersInfo from "@/Functions/organization/getUsersInfo";
import verifyOrganizationToken from "@/Functions/organization/verifyOrganizationToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { LuCalendarClock } from "react-icons/lu";
import getAttendenceInfo from "@/Functions/organization/getAttendenceInfo";

export default function Index(){

    const router = useRouter()

    const [isLoad, setLoad] = useState(false)
    const [usersInfo, setUsersInfo] = useState([])
    const [organizationInfo, setOrganizationInfo] = useState({})
    const [updateInfo, setUpdateInfo] = useState(0)
    const [year, setYear] = useState('');
    const [mounth, setMounth] = useState('');


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

        await markAllAttendence(token)
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



    return (
        <div className="w-full h-screen overflow-x-hidden py-5 px-2 sm:p-10  ">
            <ShowIf when={isLoad} isLoading={true}>
                <div className="text-2xl font-semibold w-full flex flex-col gap-4">
                    <div className="flex gap-5 sm:gap-10">
                        <div>
                            <div>Hey,</div>
                            <div className="text-5xl">{organizationInfo.name}</div>
                        </div>
                        <div className="text-xs self-end">
                            <Button onClick={() => router.push('/organization/create-user')}>Add new Student</Button>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="text-xs">
                            <Button onClick={() => router.push('/organization/update-attendance')}>Update Attendance</Button>
                        </div>
                    </div>
                    <Hr/>
                </div>

                <main className="flex flex-col overflow-y-scroll">
                    <div className="flex gap-5 px-2 sm:px-3 mb-2">
                        <div className="max-sm:text-sm font-sans border-b-black border-b-2 px-2 text-center box-content">Attendece Table</div>
                        <div className="text-sm flex gap-2 items-center">
                            <div className="w-12 relative flex items-center border-b-2 border-black">
                                <input 
                                    value={year} 
                                    type="text" 
                                    placeholder="Year" 
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
                                    placeholder="Year" 
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
                            <button 
                                className="relative ml-1 font-sans text-[13px] border-2 border-black font-semibold opacity-90 sm:hover:bg-black sm:hover:text-white transition-all active:bg-black active:text-white px-2 rounded-md py-1 animate-bounce h-6 top-[6px] whitespace-nowrap flex items-center gap-1"
                                onClick={() => setUpdateInfo((updateInfo) => updateInfo + 1)}
                            >
                                Set <LuCalendarClock/>
                            </button>
                        </div>
                    </div>
                    <div className="w-full h-fil borde-2 rounded-md py-5 sm:px-1">
                        {
                            usersInfo.map((userInfo, index) => {
                                return <AttendeceRow 
                                            key={index} 
                                            index={index+1} 
                                            name={userInfo.name} 
                                            roomNo={userInfo.roomNo} 
                                            attendenceId={userInfo.attendenceId}
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
            </ShowIf>
        </div>
    )
}


function AttendeceRow({index, name, roomNo, attendenceId, mounth, year, updateInfo}){

    const [presentDays, setPresentDays] = useState([]);
    const [attendenceStatus, setAttendenceStatus] = useState([]);
    const [isUpdate, setUpdate] = useState(false);

    async function hendalAttendenceInfo() { 
        if(isUpdate) return;

        setUpdate(true);
        let {miss, attendenceInfo} = await getAttendenceInfo(
                localStorage.getItem('organization-token'), 
                attendenceId, 
                mounth, 
                year
        );

        setUpdate(false);
        if(!miss) return;

        setPresentDays(attendenceInfo?.presentDays)
        setAttendenceStatus(attendenceInfo?.attendenceStatus)
    }

    useEffect(() => {
        hendalAttendenceInfo();
    }, [updateInfo])

    return <>
        <div className="user-attendence w-full mb-3 cursor-default" style={{animation: 'animate-opacity-0-to-1 .5s'}}>
            <div className="w-full flex text-sm sm:gap-5 gap-0 pl-2">
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
                <div className="days w-full flex items-center gap-1 flex-wrap"> 
                    <div className="relative border-2 flex items-center rounded-md overflow-hidden justify-center h-6 px-2 font-mono font-semibold text-xs" style={{animationDelay: `${Math.random()*1000}ms`}}>TP:{presentDays.length}</div>
                    <div className="relative border-2 rounded-md overflow-hidden flex items-center justify-center gap-1 h-6 px-2 font-mono font-semibold text-xs" style={{animationDelay: `${Math.random()*1000}ms`}}>TA: {attendenceStatus.length - presentDays.length}</div>
                    {attendenceStatus.map(status => {
                        return (
                            <div 
                                key={status[0]} 
                                className="relative flex items-center justify-center rounded-[5px] opacity-0 border-none size-6 font-mono font-semibold text-white"
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