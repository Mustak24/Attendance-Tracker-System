
import Button from "@/Components/Button";
import Clock from "@/Components/Clock";
import ShowIf from "@/Components/ShowIf";
import { _AppContext } from "@/Contexts/AppContext";
import markAttendance from "@/Functions/users/markAttendance";
import { getTime, isOnline } from "@/Functions/miniFuntions";
import verifyUserToken from "@/Functions/users/verifyUserToken";
import getAttendanceStatus from '@/Functions/users/getTodayAttendanceStatus'
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { TypingHeading } from "@/Components/Heading";
import { HiOutlineLogout } from "react-icons/hi";
import { Popover, PopoverOnHover } from "@/Components/Popover";
import Hr from "@/Components/Hr";
import logoutUser from "@/Functions/users/logoutUser";


export default function Home() {

  const router = useRouter();

  const {setAlert} = useContext(_AppContext);

  const [isLoad, setLoad] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState('Wait ...');
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [time, setTime] = useState('05:30:00 AM');


  async function handleAttendance(){
    if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internel connetion.'}]);

    setLoading(true);
    let token = localStorage.getItem('user-token');
    let {alert} = await markAttendance(token);
    setLoading(false);

    setAlert((alerts) => [...alerts, alert]);

    return getAttendanceStatus(token).then(({attendanceStatus}) => {
        setAttendanceStatus(attendanceStatus || 'Not Marked');
    })
  }

  async function handleLogout(){
    let {miss, alert} = await logoutUser(localStorage.getItem('user-token'));
    localStorage.removeItem('user-token')
    if(miss) setAlert((alerts) => [...alerts, alert]);
    return router.push('/');
  }

  async function verifyUser(){
    let {miss, user} = await verifyUserToken(localStorage.getItem('user-token'));
    if(!miss) return router.push('/');

    setLoad(true);
    setUserInfo(user)
    handleAttendance()
  }

  useEffect(() => {
    if(userInfo.name && router.query['user-name'] != userInfo.name) {
      router.push(`/user/${userInfo.name}`)
    }
  }, [router.query, userInfo])


  useEffect(() => {

    verifyUser();
   
    const interval = setInterval(() => {
      setTime(getTime())
    }, 1000);
    
    return () => clearInterval(interval);

  }, []);



  return (
    <main className="w-full h-screen flex items-center justify-center select-none">
      <ShowIf when={isLoad} loading={true}>
        <div className="relative sm:p-10 flex flex-col gap-5 w-full h-screen overflow-x-hidden bg-[rgb(65,166,255">
            <div className="flex max-md:items-center justify-between max-md:flex-col-reverse p-5">

              <div className="self-start">
                <div className="font-serif transition-all text-4xl md:text-7xl font-semibold">
                  <div className="">Hello,</div>
                  <TypingHeading className="capitalize" speed={120}>{userInfo.name}</TypingHeading>
                </div>

                <Hr/>

                <div className="max-sm:mt-2 mt-5 flex flex-col gap-1 text-white">
                  <div className="text-[3vmax] font-sans font-semibold">Your today attendance Status is,</div>
                  <div className="capitalize relative w-fit font-semibold h-6 [&_div]:rounded-md [&_div]:px-4 [&_div]:py-1 after:content-[''] after:absolute after:z-[1] after:size-3 after:bg-sky-500 after:box-content after:border-[4px] after:border-blue-200 after:top-1 after:right-1 after:rounded-full after:translate-x-[50%] after:translate-y-[-50%] before:content-[''] before:z-[10] before:absolute before:size-4 before:bg-sky-100 before:top-1 before:right-1 before:rounded-full before:translate-x-[50%] before:translate-y-[-50%] before:animate-ping before:origin-[0%_100%]">
                    <ShowIf when={attendanceStatus != 'present' && attendanceStatus != 'absent'}>
                      <div className="bg-zinc-500 capitalize">{attendanceStatus}</div>
                    </ShowIf>
                    <ShowIf when={attendanceStatus == 'present'}>
                      <div className="bg-green-400">Present</div>
                    </ShowIf>
                    <ShowIf when={attendanceStatus == 'absent'}>
                      <div className="bg-red-500">Absent</div>
                    </ShowIf>
                  </div>
                </div>

                <Hr/>

                <div className="mt-5 text-[3vmax] font-sans font-semibold flex items-center gap-2 flex-wrap  ">
                  <div className="text-sm">
                    <Button className="animate-bounce top-2" isLoading={isLoading} onClick={()=>handleAttendance()}>Click For</Button>
                  </div>
                  <p>Mark Present,</p>
                  <div>{time}</div>
                </div>

                <Hr className="h-fit px-2 pr-10">
                  <TypingHeading className="text-xs text-white font-mono">Attendace will be Marke in give time by your Organization.</TypingHeading>
                </Hr>

              </div>

              <div className=" transition-all">
                <Clock/>  
              </div>

            </div>
              <button className="fixed top-2 right-2 text-4xl group" onClick={handleLogout}>
                <PopoverOnHover>
                    <HiOutlineLogout className="group-active:scale-90" />
                  <Popover className={'text-xs right-3 font-mono rounded-md bg-[rgb(255,255,255,.5)] py-1 px-3 max-sm:hidden'}>Logout</Popover>
                </PopoverOnHover>
              </button>
        </div>
      </ShowIf>
    </main>
  );
}
