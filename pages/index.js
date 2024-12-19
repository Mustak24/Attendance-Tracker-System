
import { _AppContext } from "@/Contexts/AppContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";



export default function Home() {

  const router = useRouter()
  const {setAlert} = useContext(_AppContext)
  const [isValid, setValid] = useState(false);
  const [ip, setIp] = useState('wait ...')


  useEffect(() => {
    let token = localStorage.getItem('user-token');
    if(!token) return router.push('/login');

    fetch('https://api.ipify.org?format=json').then(res => res.json()).then(res => {
      setIp(res.ip)
      setValid(res.ip == process.env.NEXT_PUBLIC_HOSTEL_IP)
    })

  }, [])

  return (
   <div className="w-full h-full overflow-x-hidden">
    <div>
      ip : {ip}
    </div>
    valid : {String(isValid)}
   </div>
  );
}
