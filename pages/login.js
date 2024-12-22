import { Input } from "@/Components/Input";
import { TypingHeading } from "@/Components/Heading";
import Button, { LongWidthBnt } from "@/Components/Button";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { _AppContext } from "@/Contexts/AppContext";
import { isObjectEmpty, isOnline } from "@/Functions/miniFuntions";
import ShowIf from "@/Components/ShowIf";
import verifyUserToken from "@/Functions/verifyUserToken";
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
        let {miss, alert, token} = await res.json();

        setLoading(false);
        setAlert((alerts) => [...alerts, alert])

        if(!miss) return;
        localStorage.setItem('user-token', token)
        return router.push('/')
    }

    async function verify() {
        let token = localStorage.getItem('user-token');
        if(!token) return setLoad(true);
        let res = await verifyUserToken(token)
        if(res.miss) return router.push('/')
        setLoad(true);
    }

    useEffect(() => {
        verify();
    }, [])

    return (
        <div className="flex items-center justify-center w-full h-[100svh] overflow-hidden text-white">
            <div className="absolute top-4 left-4 text-[6vmax] font-bold cursor-default z-[100]" onClick={()=>router.push('/warden/login')}>Welcome,</div>
            <main className="w-full h-full flex items-center flex-col justify-center p-5 relative max-sm:bottom-20">
                <ShowIf when={isLoad} loading={true}>
                    <TypingHeading className="font-serif text-2xl my-5">- Login Form -</TypingHeading>
                    <form onSubmit={handleSubmit} className="flex items-center flex-col gap-4 max-w-[500px] w-full" >
                        <Input minLength={6} name={'username'} placeholder="Enter Username" />
                        <Input minLength={6} name={'password'} placeholder="Enter Password" type='password' />
                        <div className="w-full">
                            <LongWidthBnt isLoading={isLoading} title='Login' className='w-full max-md:hidden' />
                            <Button isLoading={isLoading} title='Login' className='md:hidden w-full border-2' />
                        </div>
                        <div className="text-sm hidden gap-2 font-mono text-black">add Member? <Link href={'/signup'} className="text-white opacity-90 active:opacity-100 sm:hover:opacity-100 font-semibold">Sign-up</Link></div>
                    </form>
                </ShowIf>
            </main>
        </div>
    )
}