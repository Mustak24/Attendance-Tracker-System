
import Button from "@/Components/Button";
import Clock from "@/Components/Clock";
import ShowIf from "@/Components/ShowIf";
import { _AppContext } from "@/Contexts/AppContext";
import markAttendence from "@/Functions/markAttendence";
import { isOnline } from "@/Functions/miniFuntions";
import verifyUserToken from "@/Functions/verifyUserToken";
import getAttendenceStatus from '@/Functions/getAttendenceStatus'
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";



export default function Home() {

  const router = useRouter();
  const {setAlert} = useContext(_AppContext);

  const [isLoad, setLoad] = useState(true);
  const [attendence, setAttendence] = useState('not marked');
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [time, setTime] = useState(0);


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



  useEffect(() => {
    let token = localStorage.getItem('user-token');
    if(!token) return router.push('/login');

    if(!isOnline()) return setAlert((alerts) => [...alerts, {status: 'error', msg: 'No internel connetion.'}]);

    verifyUserToken(token).then(res => {
      setLoad(true);
      if(!res.miss) return router.push('/login')
      setUserInfo(res.user)
      return handleAttendence()
    })

    let interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000);

    return ()=>clearInterval(interval);

  }, []);



  return (
    <div className="relative sm:p-10 flex flex-col gap-5 w-full h-screen overflow-x-hidden bg-[rgb(65,166,255)]">
      <ShowIf when={isLoad} loading={true}>
        <div className="flex max-md:items-center justify-between max-md:flex-col-reverse p-5">

          <div className="text-white self-start">
            <div className="font-serif transition-all text-4xl md:text-7xl font-semibold">
              <div className="">Hello,</div>
              <div className="capitalize">{userInfo.name}</div>
            </div>

            <div className="mt-5 h-2 rounded-sm" 
              style={{backgroundImage: 'linear-gradient(90deg, white, transparent)'}}>
            </div>

            <div className="max-sm:mt-2 mt-5 flex flex-col gap-1">
              <div className="text-[3vmax] font-sans font-semibold">Your today attendence Status is,</div>
              <div className="capitalize w-fit text-white font-semibold">
                <ShowIf when={attendence == 'not marked'}>
                  <div className="bg-zinc-500 rounded-md px-2">Not Marked</div>
                </ShowIf>
                <ShowIf when={attendence == 'present'}>
                  <div className="bg-green-500 rounded-md px-2">Present</div>
                </ShowIf>
                <ShowIf when={attendence == 'absent'}>
                  <div className="bg-red-500 rounded-md px-2">Absent</div>
                </ShowIf>
              </div>
            </div>

            <div className="mt-5 h-2 rounded-sm" 
              style={{backgroundImage: 'linear-gradient(90deg, white, transparent)'}}>
            </div>

            <div className="mt-5 text-[3vmax] font-sans font-semibold flex items-center gap-2 flex-wrap  ">
              <div className="text-sm">
                <Button isLoading={isLoading} onClick={()=>handleAttendence()}>Click For</Button>
              </div>
              <p>Mark Present,</p>
              <div>{time}</div>
            </div>

            <div className="mt-5 rounded-sm text-zinc-800 px-2 text-xs font-semibold font-mono"  
              style={{backgroundImage: 'linear-gradient(90deg, white, transparent)'}}>
                Attendece will be Marke Between 8:00 PM to 9:00 PM
            </div>

          </div>

          <div className=" transition-all">
            <Clock/>  
          </div>

        </div>
      </ShowIf>
    </div>
  );
}
