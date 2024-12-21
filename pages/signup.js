import { Input } from "@/Components/Input";
import { TypingHeading } from "@/Components/Heading";
import Button, { LongWidthBnt } from "@/Components/Button";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { _AppContext } from "@/Contexts/AppContext";
import { isNumber, isObjectEmpty, isOnline } from "@/Functions/miniFuntions";
import Link from "next/link";


export default function Login(){

    const {setAlert} = useContext(_AppContext)

    const [isLoading, setLoading] = useState(false)
    const [isLoad, setLoad] = useState(false)


    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internet conections.'}])
        
        let formData = Object.fromEntries(new FormData(e.target));
        if(isObjectEmpty(formData)) return setAlert((alerts) => [...alerts, {type: 'warning', msg: 'Please fill all form fields.'}])
        
        let token = localStorage.getItem('warden-token');
        if(!token) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'You don\'t have pormistion to create new account !!!.'}])

        setLoading(true);

        let res = await fetch(`${window.location.origin}/api/users/signup`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        let {miss, alert} = await res.json();
        setLoading(false)
        setAlert((alerts) => [...alerts, alert])
        if(miss) return router.push('/login')
    }

    return (
        <div className="flex items-center justify-center w-full h-[100svh] overflow-hidden text-white">
            <main className="w-full h-full flex items-center flex-col justify-center p-5 relative max-sm:bottom-20">
                <TypingHeading className="font-serif text-2xl my-5">- SignUp Form -</TypingHeading>
                <form onSubmit={handleSubmit} className="relative flex items-center flex-col gap-4 max-w-[500px] w-full" >
                    <div className="flex items-center justify-center w-full gap-5 max-sm:flex-col">
                        <Input minLength={6} name={'name'} placeholder="Enter Name" />
                        <Input minLength={10} name={'mobileNo'} placeholder="Enter Mobile Number" maxLength={10} />
                    </div>
                    <div className="flex items-center gap-5 w-full flex-wrap">
                        <div className="flex-1">
                            <Input minLength={6} name={'username'} placeholder="Enter Username" />
                        </div>
                        <input  
                            name="roomNo"
                            placeholder="Room No"
                            maxLength={3}
                            className="input border-2 bg-transparent rounded-full outline-none border-white placeholder:font-thin placeholder:text-slate-200 w-24 h-10 pl-4 pr-3 text-sm font-semibold"
                            onChange={(e)=>{
                                let value = e.target.value;
                                if(isNumber(value)) return;
                                e.target.value = value.slice(0, value.length-1);
                            }}
                        />
                    </div>
                    <Input minLength={6} name={'password'} placeholder="Enter Password" type='password' />
                    <div className="w-full">
                        <LongWidthBnt isLoading={isLoading} title='SignUp' className='w-full max-md:hidden' />
                        <Button isLoading={isLoading} title='SignUp' className='md:hidden w-full border-2' />
                    </div>
                    <div className="text-sm flex gap-2 font-mono text-black">Already have account? <Link href={'/login'} className="text-white opacity-90 active:opacity-100 sm:hover:opacity-100 font-semibold">log-in</Link></div>
                </form>
            </main>
        </div>
    )
}