import Button, { LongWidthBnt } from "@/Components/Button";
import { TypingHeading } from "@/Components/Heading";
import { Input } from "@/Components/Input";
import { _AppContext } from "@/Contexts/AppContext";
import { isObjectEmpty, isOnline } from "@/Functions/miniFuntions";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function AdminSignup(){

    const {setAlert} = useContext(_AppContext);
    
    const router = useRouter()

    const [isLoading, setLoading] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        if(!isOnline()) return setAlert((alerts) => [...alerts, {status: 'error', msg: 'No Internet connection'}]);

        let formData = Object.fromEntries(new FormData(e.target))
        if(isObjectEmpty(formData)) return setAlert((alerts) => [...alerts, {status: 'error', msg: 'All filed are required.'}])
        
        setLoading(true)
        
        let res = await fetch(`${window.location.origin}/api/organization/signup`, {
            method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(formData)
        })
        let {alert, miss, token, organization} = await res.json();
        setLoading(false)

        setAlert((alerts) => [...alerts, alert]);
        if(!miss) return;

        localStorage.setItem('organization-token', token);
        return router.push(`/organization/${organization.name}`)
    }


    return (
        <div className="flex items-center justify-center w-full h-[100svh] overflow-hidden ">
            <div className="absolute flex flex-col top-4 left-4 text-[2vmax] font-bold cursor-default z-[100]">
                Welcome,
                <div className="text-[3em]">Organization</div>
            </div>
            
            <main className="w-full h-full flex items-center flex-col justify-center p-5 relative max-sm:bottom-20">
                <TypingHeading className="font-serif text-2xl my-5">- Sign Up Form -</TypingHeading>
                <form onSubmit={handleSubmit} className="flex items-center flex-col gap-4 max-w-[500px] w-full" >
                    <div className="flex flex-wrap [&_input]:flex-1 w-full gap-5"> 
                        <input 
                            name="name"
                            type="text"  
                            placeholder="Enter Name"
                            minLength={3}
                            required
                            className="border-2 bg-transparent rounded-full border-black placeholder:text-black placeholder:font-normal placeholder:opacity-70 outline-none min-w-[100px] h-10 pl-4 pr-3 text-sm font-semibold focus:border-sky-500  "
                        />
                        <input 
                            name="organizationNo"
                            type="text"  
                            placeholder="Sr. No"
                            maxLength={2}
                            required
                            className="border-2 bg-transparent rounded-full border-black placeholder:text-black placeholder:opacity-70 placeholder:font-thin outline-none max-w-24 h-10 pl-4 pr-3 text-sm font-semibold focus:border-sky-500 "
                        />
                    </div>
                    <Input required={true} minLength={5} name='username' placeholder="Enter Username" />
                    <Input required={true} minLength={5} name='password' placeholder="Enter Password" type='password' />
                    <div className="w-full">
                        <LongWidthBnt isLoading={isLoading} title='Sign Up' className='w-full max-md:hidden' />
                        <Button isLoading={isLoading} title='Sign Up' className='md:hidden w-full border-2' />
                    </div>
                    <div className="text-sm flex gap-2 text-black font-mono">Have a account? <Link href={'/organization/login'} className="opacity-70 active:opacity-100 sm:hover:opacity-100 font-semibold">login</Link></div>
                </form>
            </main>
        </div>
    )
}