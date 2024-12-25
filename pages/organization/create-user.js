import { Input } from "@/Components/Input";
import { TypingHeading } from "@/Components/Heading";
import Button, { LongWidthBnt } from "@/Components/Button";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { _AppContext } from "@/Contexts/AppContext";
import { isNumber, isObjectEmpty, isOnline } from "@/Functions/miniFuntions";
import { FaRegUser } from "react-icons/fa";
import createUser from "@/Functions/organization/createUser";
import ShowIf from "@/Components/ShowIf";
import verifyOrganizationToken from "@/Functions/organization/verifyOrganizationToken";



export default function Login(){

    const {setAlert} = useContext(_AppContext)

    const [isLoading, setLoading] = useState(false)
    const [isLoad, setLoad] = useState(false)

    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        e.target.reset()
        
        if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internet conections.'}]);
        
        let formData = Object.fromEntries(new FormData(e.target));

        if(isObjectEmpty(formData)) 
            return setAlert((alerts) => [...alerts, {type: 'warning', msg: 'Please fill all form fields.'}]);

        setLoading(true);
        let {alert} = await createUser(localStorage.getItem('organization-token'), formData);
        setLoading(false);

        setAlert((alerts) => [...alerts, alert]);
    }

    async function verify(){
        let {miss} = await verifyOrganizationToken(localStorage.getItem('organization-token'));
        if(!miss) return router.push('/');
        return setLoad(true);
    }

    useEffect(() => {
        verify()
    }, [])

    return (
        <div className="flex items-center justify-center w-full h-[100svh] overflow-hidden ">
            <ShowIf when={isLoad} isLoading={true}>
            <div className="absolute top-4 left-4 text-[5vmax] font-bold cursor-default z-[100] flex items-center">
                Add New 
                <FaRegUser className="ml-2 bottom-1 relative" />
                ,
            </div>
            <main className="w-full h-full flex items-center flex-col justify-center p-5 relative max-sm:bottom-20">
                <TypingHeading className="font-serif text-2xl my-5">- SignUp Form -</TypingHeading>
                <form onSubmit={handleSubmit} className="relative flex items-center flex-col gap-4 max-w-[500px] w-full" >
                    <div className="flex items-center justify-center w-full gap-5 max-sm:flex-col">
                        <Input minLength={3} name={'name'} placeholder="Enter Name" />
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
                            className="input border-2 bg-transparent rounded-full outline-none border-black placeholder:font-normal placeholder:text-black placeholder:opacity-70 w-24 h-10 pl-4 pr-3 text-sm font-semibold focus:border-sky-500"
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
                    <div className="text-sm flex gap-2 font-mono text-black">This Form will add new user in you organization.</div>
                </form>
            </main>
            </ShowIf>
        </div>
    )
}