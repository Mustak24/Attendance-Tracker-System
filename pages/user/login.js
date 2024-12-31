import { Input } from "@/Components/Input";
import { TypingHeading } from "@/Components/Heading";
import Button, { LongWidthBnt } from "@/Components/Button";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { _AppContext } from "@/Contexts/AppContext";
import { isObjectEmpty, isOnline } from "@/Functions/miniFuntions";
import ShowIf from "@/Components/ShowIf";
import verifyUserToken from "@/Functions/users/verifyUserToken";
import Link from "next/link";


export default function Login(){

    const {setAlert} = useContext(_AppContext)

    const [isLoading, setLoading] = useState(false)
    const [isLoad, setLoad] = useState(false)


    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internet conections.'}])

        let formData = Object.fromEntries(new FormData(e.target));

        if(isObjectEmpty(formData)) return setAlert((alerts) => [...alerts, {type: 'warning', msg: 'Please fill all form fields.'}])

        setLoading(true);

        let res = await fetch(`${window.location.origin}/api/users/login`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(formData)
        });
        let {miss, alert, token, user} = await res.json();

        setLoading(false);
        setAlert((alerts) => [...alerts, alert])

        if(!miss) return;
        localStorage.setItem('user-token', token)
        return router.push(`/user/${user.name}`)
    }

    async function verify() {
        let {miss, user} = await verifyUserToken(localStorage.getItem('user-token'));
        if(!miss) return setLoad(true);

        router.push(`/user/${user.name}`);
    }

    useEffect(() => {
        verify();
    }, [])

    return (
        <div className="flex items-center justify-center w-full h-[100svh] overflow-hidden">
            <div className="absolute top-4 left-4 text-[6vmax] font-bold cursor-default z-[100]" onClick={()=>router.push('/organization/login')}>Hello,</div>
            <main className="w-full h-full flex items-center flex-col justify-center p-5 relative max-sm:bottom-20">
                <ShowIf when={isLoad} loading={true}>
                    <TypingHeading className="font-serif text-2xl my-5">- User Login Form -</TypingHeading>
                    <form onSubmit={handleSubmit} className="flex items-center flex-col gap-4 max-w-[500px] w-full" >
                        <div className="flex flex-wrap-reverse [&_input]:flex-1 w-full gap-5"> 
                            <input 
                                name="username"
                                type="text"  
                                placeholder="Enter username"
                                minLength={3}
                                required
                                className="border-2 bg-transparent rounded-full border-black placeholder:text-black placeholder:font-normal placeholder:opacity-70 outline-none min-w-[150px] h-10 pl-4 pr-3 text-sm font-semibold focus:border-sky-500  "
                            />
                            <input 
                                name="organizationNo"
                                type="text"  
                                placeholder="Or. No"
                                maxLength={5}
                                required
                                className="border-2 bg-transparent rounded-full border-black placeholder:text-black placeholder:opacity-70 placeholder:font-normal outline-none max-w-20 h-10 pl-4 pr-3 text-sm font-semibold focus:border-sky-500 "
                            />
                        </div>
                        <Input required={true} minLength={6} name={'password'} placeholder="Enter Password" type='password' />
                        <div className="w-full">
                            <LongWidthBnt isLoading={isLoading} title='Login' className='w-full max-md:hidden' />
                            <Button isLoading={isLoading} title='Login' className='md:hidden w-full border-2' />
                        </div>
                        <div className="text-sm flex items-center justify-center flex-wrap gap-2 font-mono text-black">create new organization? <Link href={'/organization/signup'} className="opacity-90 active:opacity-100 sm:hover:opacity-100 font-semibold text-sky-500">Sign-up</Link></div>
                    </form>
                </ShowIf>
            </main>
        </div>
    )
}