
import Button from "@/Components/Button";
import Clock from "@/Components/Clock";
import ShowIf from "@/Components/ShowIf";
import { _AppContext } from "@/Contexts/AppContext";
import markAttendence from "@/Functions/markAttendence";
import { getTime, isOnline } from "@/Functions/miniFuntions";
import verifyUserToken from "@/Functions/verifyUserToken";
import getAttendenceStatus from '@/Functions/getAttendenceStatus'
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { TypingHeading } from "@/Components/Heading";
import { HiOutlineLogout } from "react-icons/hi";
import { Popover, PopoverOnHover } from "@/Components/Popover";


export default function Home() {

  const router = useRouter();
  const {setAlert} = useContext(_AppContext);

  const [isLoad, setLoad] = useState(false);
  const [attendence, setAttendence] = useState('not marked');
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [time, setTime] = useState('05:30:00 AM');


  async function handleAttendence(){
    if(!isOnline()) return setAlert((alerts) => [...alerts, {status: 'error', msg: 'No internel connetion.'}]);

    setLoading(true);
    let token = localStorage.getItem('user-token');
    let {status, msg, attendenceStatus} = await markAttendence(token);

    setAttendence(attendenceStatus || 'not marked');

    setLoading(false);
    setAlert((alerts) => [...alerts, {status, msg}]);

    return getAttendenceStatus(token).then(res => {
        setAttendence(res.attendenceStatus.status || 'not marked');
    })
  }

  function handleLogout(){
    localStorage.removeItem('user-token')
    return router.push('/login');
  }



  useEffect(() => {
    let token = localStorage.getItem('user-token');
    if(!token) return router.push('/login');

    if(!isOnline()) return setAlert((alerts) => [...alerts, {status: 'error', msg: 'No internel connetion.'}]);

    verifyUserToken(token).then(res => {
      if(!res.miss) return router.push('/login')
      setLoad(true);
      setUserInfo(res.user)
      return handleAttendence()
    })

    let interval = setInterval(() => {
      setTime(getTime())
    }, 1000);

    return ()=>clearInterval(interval);

  }, []);



  return (
    <main className="w-full h-screen flex items-center justify-center">
      <ShowIf when={isLoad} loading={true}>
        <div className="relative sm:p-10 flex flex-col gap-5 w-full h-screen overflow-x-hidden bg-[rgb(65,166,255)]">
            <div className="flex max-md:items-center justify-between max-md:flex-col-reverse p-5">

              <div className="text-white self-start">
                <div className="font-serif transition-all text-4xl md:text-7xl font-semibold">
                  <div className="">Hello,</div>
                  <TypingHeading className="capitalize" speed={120}>{userInfo.name}</TypingHeading>
                </div>

                <div className="mt-5 h-2 rounded-sm" 
                  style={{backgroundImage: 'linear-gradient(90deg, white, transparent)'}}>
                </div>

                <div className="max-sm:mt-2 mt-5 flex flex-col gap-1">
                  <div className="text-[3vmax] font-sans font-semibold">Your today attendence Status is,</div>
                  <div className="capitalize relative w-fit text-white font-semibold h-6 [&_div]:rounded-md [&_div]:px-4 [&_div]:py-1 after:content-[''] after:absolute after:z-[1] after:size-3 after:bg-slate-100 after:box-content after:border-[4px] after:border-blue-400 after:top-1 after:right-1 after:rounded-full after:translate-x-[50%] after:translate-y-[-50%] before:content-[''] before:z-[10] before:absolute before:size-4 before:bg-slate-100 before:top-1 before:right-1 before:rounded-full before:translate-x-[50%] before:translate-y-[-50%] before:animate-ping before:origin-[0%_100%]">
                    <ShowIf when={attendence == 'not marked'}>
                      <div className="bg-zinc-500">Not Marked</div>
                    </ShowIf>
                    <ShowIf when={attendence == 'present'}>
                      <div className="bg-green-400">Present</div>
                    </ShowIf>
                    <ShowIf when={attendence == 'absent'}>
                      <div className="bg-red-500">Absent</div>
                    </ShowIf>
                  </div>
                </div>

                <div className="mt-5 h-2 rounded-sm" 
                  style={{backgroundImage: 'linear-gradient(90deg, white, transparent)'}}>
                </div>

                <div className="mt-5 text-[3vmax] font-sans font-semibold flex items-center gap-2 flex-wrap  ">
                  <div className="text-sm">
                    <Button className="animate-bounce top-2" isLoading={isLoading} onClick={()=>handleAttendence()}>Click For</Button>
                  </div>
                  <p>Mark Present,</p>
                  <div>{time}</div>
                </div>

                <div className="mt-5 rounded-sm text-zinc-800 px-2 text-xs font-semibold font-mono"  
                  style={{backgroundImage: 'linear-gradient(90deg, white, transparent)'}}>
                    <TypingHeading>Attendece will be Marke Between 8:00 PM to 9:00 PM</TypingHeading>
                </div>

              </div>

              <div className=" transition-all">
                <Clock/>  
              </div>

            </div>
              <button className="fixed top-2 right-2 text-4xl text-white group" onClick={handleLogout}>
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
