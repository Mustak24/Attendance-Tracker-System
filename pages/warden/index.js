import Button from "@/Components/Button";
import Hr from "@/Components/Hr";
import { Popover, PopoverOnHover } from "@/Components/Popover";
import { ShowIfElse } from "@/Components/ShowIf";
import { _AppContext } from "@/Contexts/AppContext";
import { isNumber } from "@/Functions/miniFuntions";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { LuCalendarClock } from "react-icons/lu";

export default function Index(){

    const {setAlert} = useContext(_AppContext);

    const router = useRouter()

    const [userInfo, setUserInfo] = useState({})
    const [time, setTime] = useState([])
    const [year, setYear] = useState('');
    const [mounth, setMounth] = useState('');


    useEffect(() => {
        let time = new Date()
        setTime(time.toLocaleDateString().split('/'))
        setYear(String(time.getFullYear()));
        setMounth(String(time.getMonth()));
    }, [])

    function handleLogout(){
        localStorage.removeItem('warden-token');
        router.push('/warden/login');
    }



    return (
        <div className="w-full h-screen overflow-x-hidden p-5 pr-2 sm:p-10 bg-sky-500 text-white">
            <div className="text-2xl font-semibold w-full">
                <div className="flex gap-5 sm:gap-10">
                    <div>
                        <div>Hey,</div>
                        <div className="text-5xl">Head</div>
                    </div>
                    <div className="text-xs self-end">
                        <Button onClick={() => router.push('/signup')}>Add new Student</Button>
                    </div>
                </div>
                <Hr/>
            </div>

            <main className="flex flex-col overflow-y-scroll">
                <div className="flex gap-5 px-2 sm:px-3 mb-2">
                    <div className="max-sm:text-sm">Attendece Table</div>
                    <div className="text-sm flex gap-2 items-center">
                        <div className="w-12 relative flex items-center border-b-2">
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
                        <div className="w-8 relative flex items-center border-b-2">
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
                        <button className="bg-white font-sans text-[13px] font-semibold text-black opacity-90 hover:opacity-70 transition-all active:scale-95 px-2 rounded-md py-1 animate-bounce h-6 relative top-[6px] whitespace-nowrap flex items-center gap-1">Set <LuCalendarClock/></button>
                    </div>
                </div>
                <div className="w-full h-fil borde-2 rounded-md py-5 sm:px-1">
                    <AttendeceRow index={1} name={'Name'} roomNo={'Room No'}></AttendeceRow>
                    <AttendeceRow index={2} name={'Name'} roomNo={'Room No'}></AttendeceRow>
                </div>
            </main>
            <button className="fixed top-2 right-2 text-4xl text-white group" onClick={handleLogout}>
                <PopoverOnHover>
                    <HiOutlineLogout className="group-active:scale-90" />
                    <Popover className={'text-xs right-3 font-mono rounded-md bg-[rgb(255,255,255,.5)] py-1 px-3 max-sm:hidden'}>Logout</Popover>
                </PopoverOnHover>
            </button>
        </div>
    )
}


function AttendeceRow({index, name, roomNo, attendenceInfo={}}){
    return <>
        <div className="user-attendence w-full mb-3 cursor-default">
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
                                <div className="absolute whitespace-nowrap bottom-full left-2 text-white px-2 py-1 rounded-md max-w-[200px] bg-black opacity-70 hidden group-hover:flex">{name}</div>
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
                    {Array.from({length: new Date(2024, 12, 0).getDate()}).map((e, i) => {
                        return (
                            <div 
                                key={i} 
                                className="relative flex items-center justify-center size-6 after:size-full after:opacity-50 after:rounded-sm after:absolute after:border-2 font-mono font-semibold"
                                style={{backgroundColor: ''}}
                            >
                                {i+1}
                            </div>
                        )
                    })}
                    <div className="relative bg-white text-black flex items-center rounded-sm overflow-hidden justify-center h-6 px-2 font-mono font-semibold animate-pulse text-xs" style={{animationDelay: `${Math.random()*1000}ms`}}>TP:{'21'}</div>
                    <div className="relative bg-white text-black rounded-sm overflow-hidden flex items-center justify-center gap-1 h-6 px-2 font-mono font-semibold animate-pulse text-xs" style={{animationDelay: `${Math.random()*1000}ms`}}>TA: {'10'}</div>
                </div>
            </div>
            <Hr className="h-1 my-1 w-full"/>
        </div>
    </>
}