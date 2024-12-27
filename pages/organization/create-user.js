import { Input } from "@/Components/Input";
import { TypingHeading } from "@/Components/Heading";
import Button, { LongWidthBnt } from "@/Components/Button";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { _AppContext } from "@/Contexts/AppContext";
import { isNumber, isObjectEmpty, isOnline } from "@/Functions/miniFuntions";
import { FaRegUser } from "react-icons/fa";
import createUser from "@/Functions/organization/createUser";
import ShowIf, { ShowIfElse } from "@/Components/ShowIf";
import verifyOrganizationToken from "@/Functions/organization/verifyOrganizationToken";
import { set } from "mongoose";



export default function Login(){

    const {setAlert} = useContext(_AppContext)

    const [isLoading, setLoading] = useState(false)
    const [isLoad, setLoad] = useState(false);

    const [isFileDataValid, setFileDataValid] = useState(false);
    const [isFileDataLoading, setFileDataLoading] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [filename, setFilename] = useState('');

    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        
        if(!isOnline()) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'No internet conections.'}]);
        
        let formData = Object.fromEntries(new FormData(e.target));

        if(isObjectEmpty(formData)) 
            return setAlert((alerts) => [...alerts, {type: 'warning', msg: 'Please fill all form fields.'}]);

        
        setLoading(true);
        let {alert, miss} = await createUser(localStorage.getItem('organization-token'), formData);
        setLoading(false);

        setAlert((alerts) => [...alerts, alert]);

        if(miss) e.target.reset();
    }

    async function verify(){
        let {miss} = await verifyOrganizationToken(localStorage.getItem('organization-token'));
        if(!miss) return router.push('/');
        return setLoad(true);
    }

    async function createUsers(usersData) {
        setLoading(true);
        setAlert((alerts) => [...alerts, {type: 'info', msg: 'Creating users ...'}]);
        for(let user of usersData){
            let {alert, miss} = await createUser(localStorage.getItem('organization-token'), user);
            if(!miss) setAlert((alerts) => [...alerts, alert]);
        }
        setLoading(false);
        setFileDataValid(false);
        setAlert((alerts) => [...alerts, {type: 'info', msg: 'Users added successfully Whose infomation is valid.'}]);
    }

    function handleFileData(e){
        setFileDataValid(false);

        let file = e.target.files[0];
        if(!file) return;

        setFilename(file.name);
        setFileDataLoading(true);

        let fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = function(){
            if(file.name.includes('.json')) return handleJsonFileData(fileReader.result);
            if(file.name.includes('.csv')) return handleCsvFileData(fileReader.result);
            setAlert((alerts) => [...alerts, {type: 'error', msg: 'Invalid file type.'}]);
            setFileDataLoading(false);
        }
    }

    function handleJsonFileData(data){
        try{
            data = JSON.parse(data);
            if(!Array.isArray(data)) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'Invalid JSON file.'}]);
        
            for(let user of data){
                let {name, username, mobileNo, roomNo, password} = user;
                if(!(name && username && mobileNo && roomNo && password)) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'Invalid JSON file.'}]);
            }

            setFileData(data);
            setFileDataValid(true);
            setAlert((alerts) => [...alerts, {type: 'success', msg: 'All users data added successfully.'}]);
        } catch(error){
            console.error(error);
            setAlert((alerts) => [...alerts, {type: 'error', msg: 'Invalid JSON file.'}]);
        } finally {
            setFileDataLoading(false);
        }
    }

    function handleCsvFileData(data){
        try{
            data = data.split('\n');
            let headers = data[0].split(',');
            if(!(headers.includes('name') && headers.includes('username') && headers.includes('mobileNo') && headers.includes('roomNo') && headers.includes('password'))) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'Invalid CSV file.'}]);

            let result = [];
            for(let i=1; i<data.length; i++){
                let user = data[i].split(',');
                let obj = {};
                
                for(let j=0; j<headers.length; j++){
                    if(!user[j]) return setAlert((alerts) => [...alerts, {type: 'error', msg: 'Invalid CSV file.'}]);
                    obj[headers[j]] = user[j];
                }
                
                result.push(obj);
            }
            
            setFileData(result);
            setFileDataValid(true);
            setAlert((alerts) => [...alerts, {type: 'success', msg: 'All users added successfully.'}]);
        } catch(error){
            console.error(error);
            setAlert((alerts) => [...alerts, {type: 'error', msg: 'Invalid CSV file.'}]);
        } finally {
            setFileDataLoading(false);
        }
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
                        <div className="text-sm flex items-center justify-center flex-wrap gap-2 font-mono text-black">
                    
                            {
                                `This Form will add new user in you organization. You can also add user by upload`.split(' ').map((text, index) => <span key={index}>{text}</span>)
                            } 
                            <ShowIfElse 
                                when={!isFileDataValid} 
                                Else={
                                        <span 
                                            className="font-semibold cursor-pointer" 
                                            onClick={() => createUsers(fileData)}
                                        >
                                            Crate Acconuts {`( ${filename.length > 15 ? '...' + filename.slice(15) : filename} )`}
                                        </span>
                                    }
                            >
                                <label className="font-mono font-semibold cursor-pointer">
                                    <ShowIfElse when={!isFileDataLoading} Else={'loading ...'}>
                                        JSON file or CSV file
                                        <input onChange={handleFileData} hidden type="file" accept=".json, .csv"/>
                                    </ShowIfElse>
                                </label>
                            </ShowIfElse>
                        </div>
                    </form>
                </main>
            </ShowIf>
        </div>
    )
}