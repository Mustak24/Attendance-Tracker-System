import { Input } from "@/Components/Input";
import Button from "@/Components/Button";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { _AppContext } from "@/Contexts/AppContext";
import ShowIf from "@/Components/ShowIf";
import verifyOrganizationToken from "@/Functions/organization/verifyOrganizationToken";
import Hr from "@/Components/Hr";
import { getIp, isOnline } from "@/Functions/miniFuntions";
import updateAttendaceTime from "@/Functions/organization/updateAttendanceTime";
import updateIp from "@/Functions/organization/updateIp";
import updateUserPassword from "@/Functions/organization/updateUserPassword";


export default function Login(){

    const {setAlert} = useContext(_AppContext);

    const [isLoad, setLoad] = useState(false);
    const [organizationInfo, setOrganizationInfo] = useState({});
    const [currentIp, setCurrentIp] = useState('');
    const [isTimeUpdating, setTimeUpdating] = useState(false);
    const [isIpUpadting, setIpUpadting] = useState(false);
    const [isUserPasswordUpdating, setUserPasswordUpdating] = useState(false);


    const router = useRouter()


    async function verify(){
        let {miss, organization} = await verifyOrganizationToken(localStorage.getItem('organization-token'));
        if(!miss) return router.push('/');
        setOrganizationInfo(organization)
        setLoad(true);
    }

    useEffect(() => {
        verify();
        getIp().then(res => setCurrentIp(res));
    }, [])


    async function handleAttendanceTime(e) {
        e.preventDefault()
        
        if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internet conections.'}])
        
        setTimeUpdating(true);
        let formData = Object.fromEntries(new FormData(e.target))
        
        let {alert} = await updateAttendaceTime(localStorage.getItem('organization-token'), formData);
        setTimeUpdating(false);

        setAlert((alerts) => [...alerts, alert]);
    }

    async function handleIp(e) {
        e.preventDefault()
        
        setIpUpadting(true);
        if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internet conections.'}])
            
        let formData = Object.fromEntries(new FormData(e.target))
        setIpUpadting(false);
            
        let {alert} = await updateIp(localStorage.getItem('organization-token'), formData);

        setAlert((alerts) => [...alerts, alert]);
        
    }

    async function handleUserPassword(e) {
        e.preventDefault()
       
        if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internet conections.'}])
            
        setUserPasswordUpdating(true);
        let formData = Object.fromEntries(new FormData(e.target))

        let {alert} = await updateUserPassword(localStorage.getItem('organization-token'), formData);
        setUserPasswordUpdating(false);

        setAlert((alerts) => [...alerts, alert]);
    }


    return (
        <div className="flex items-center justify-center w-full h-[100svh] overflow-hidden ">
            <main className="w-full h-full p-5 max-sm:px-2 relative">
                <ShowIf when={isLoad} loading={true}>
                    <div>
                        <div>Hey,</div>
                        <div className="text-5xl capitalize">{
                            (organizationInfo?.name || '').length < 10 ? 
                                organizationInfo.name
                                : organizationInfo.name.slice(0,10) + '...'
                        }</div>
                    </div>
                    
                    <Hr/>
                    
                    <div className="flex flex-col mx-auto max-w-[450px] [&_form]:ml-2 [&_form]:mr-5">
                        <form onSubmit={handleAttendanceTime} className="border-2 rounded-lg p-2 flex flex-col gap-2 text-sm">
                            <div className="border-b-2 w-fit pl-1 pr-4">For Update Attendence Time</div>
                            <div className='text-xs px-2'>
                                <div>Enter Time ( 23 hr )</div>
                                <div className="my-2 flex items-center text-sm relative">
                                    <input 
                                        type="number"
                                        max={23}
                                        min={0}
                                        name="hr"
                                        placeholder="Hr"
                                        required
                                        className="border-2 text-center border-black rounded-full rounded-r-none h-10 min-w-0 px-1 flex-1" 
                                    />
                                    <span className="mx-1">:</span>
                                    <input 
                                        type="number"
                                        max={59}
                                        min={0}
                                        name="min"
                                        placeholder="Min"
                                        required
                                        className="border-2 text-center border-black rounded-full rounded-l-none h-10 min-w-0 px-1 flex-1" 
                                    />
                                    <Button isLoading={isTimeUpdating} className="text-xs ml-3 shrink-0">Update</Button>
                                </div>
                            </div>
                        </form>

                        <Hr/>

                        <form onSubmit={handleIp} className="border-2 rounded-lg p-2 flex flex-col gap-4 text-sm">
                            <div className="border-b-2 w-fit pl-1 pr-4">For Update IP</div>
                            <div className='text-xs px-2 flex gap-5'>
                                <input
                                    name='ip'
                                    placeholder="Enter your new IP"
                                    value={currentIp}
                                    className="h-10 border-2 border-black rounded-full px-4 text-sm w-full"
                                />
                                <Button isLoading={isIpUpadting} className="text-xs shrink-0">Update</Button>
                            </div>
                        </form>

                        <Hr/>

                        <form onSubmit={handleUserPassword} className="border-2 rounded-lg p-2 flex flex-col gap-4 text-sm">
                            <div className="border-b-2 w-fit pl-1 pr-4">For Update User Password</div>
                            <div className="flex flex-col gap-2 text-sm">
                                <Input
                                    name='username'
                                    placeholder="Enter username"
                                    minLength={6}
                                    required
                                />
                                <Input
                                    name='password'
                                    placeholder="Enter your new Password"
                                    minLength={6}
                                    required
                                />
                                <Button isLoading={isUserPasswordUpdating} className="text-xs">Update</Button>
                            </div>
                        </form>
                    </div>
                </ShowIf>
            </main>
        </div>
    )
}