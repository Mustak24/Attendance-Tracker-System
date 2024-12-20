import { Input } from "@/Components/Input";
import { TypingHeading } from "@/Components/Heading";
import Button, { LongWidthBnt } from "@/Components/Button";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { _AppContext } from "@/Contexts/AppContext";
import { isObjectEmpty, isOnline } from "@/Functions/miniFuntions";
import ShowIf from "@/Components/ShowIf";
import verifyUserToken from "@/Functions/verifyUserToken";


export default function Login(){

    const {setAlert} = useContext(_AppContext)

    const [isLoading, setLoading] = useState(false)
    const [isLoad, setLoad] = useState(false)


    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!isOnline()) return setAlert((alerts) => [...alerts, {status: 'error', msg: 'No internet conections.'}])

        let formData = Object.fromEntries(new FormData(e.target));

        if(isObjectEmpty(formData)) return setAlert((alerts) => [...alerts, {status: 'warning', msg: 'Please fill all form fields.'}])

        setLoading(true);
        setAlert((alerts) => [...alerts, {status: 'info', msg: 'Info send'}]);

        let res = await fetch(`${window.location.origin}/api/users/login`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(formData)
        });
        res = await res.json();
        let {miss, status, msg} = res;

        setLoading(false);
        setAlert((alerts) => [...alerts, {status, msg}])

        if(!miss) return;
        localStorage.setItem('user-token', res.token)
        return router.push('/')
    }

    useEffect(() => {
        let token = localStorage.getItem('user-token');
        if(!token) return setLoad(true);
        verifyUserToken(token).then(res => {
            setLoad(true);
            if(res.miss) return router.push('/')
        });
    })

    return (
        <div className="flex items-center justify-center w-full h-[100svh] overflow-hidden">
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
                    </form>
                </ShowIf>
            </main>
        </div>
    )
}