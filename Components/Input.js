import { useState } from "react"
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

export function Input({id, name=null, type='text', placeholder='Enter text ...', minLength, required=false}) {

    const [_, setPasswordShow] = useState(false)
    const [inputType, setInputType] = useState(type || 'text')
    const [iconRotation, setIconRotation] = useState(0)
    id = id || name || String(Math.random()*1000)

    return (
        <>
            <label htmlFor={id} className={`flex items-center border-2 relative rounded-full overflow-hidden min-w-[200px] w-full h-[40px] transition-all cursor-text has-[.input:invalid:not(:placeholder-shown)]:border-red-500 has-[.input:valid:not(:placeholder-shown)]:border-green-500 has-[.input:focus]:border-sky-500 border-black caret-black`}>
                <input
                    type={inputType}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    minLength={minLength}
                    required={required}
                    className={`input px-[15px] bg-transparent font-[700] placeholder:font-[500] text-sm w-full h-full outline-none ${type == 'password' && 'mr-8'}`}
                />
                {
                    type == 'password' &&
                        <div className="flex items-center justify-center absolute gap-5 right-[0px] translate-x-[50%] text-2xl cursor-pointer transition-all duration-1000" 
                        onClick={() => setPasswordShow((isPasswordShow) => {
                            setInputType(isPasswordShow ? 'password' : 'text');
                            setIconRotation(iconRotation + 180)
                            return !isPasswordShow;
                        })}
                        style={{rotate: `${iconRotation}deg`, transformOrigin: '100%'}}
                        >
                            <IoMdEye />
                            <IoMdEyeOff />
                        </div>
                }
            </label>
        </>
    )
}