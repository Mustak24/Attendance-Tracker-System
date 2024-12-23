import { useState } from "react"
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

export function Input({id, name=null, type='text', placeholder='Enter text ...', minLength, required=false, text='black', maxLength=null, className=''}) {

    const [_, setPasswordShow] = useState(false)
    const [inputType, setInputType] = useState(type || 'text')
    const [iconRotation, setIconRotation] = useState(0)
    id = id || name || String(Math.random()*1000)

    return (
        <>
            <label htmlFor={id} className={`${className} flex items-center border-2 relative rounded-full overflow-hidden min-w-[200px] w-full h-[40px] transition-all cursor-text has-[.input:invalid:not(:placeholder-shown)]:border-red-400 has-[.input:valid:not(:placeholder-shown)]:border-green-300 has-[.input:focus]:border-blue-600 border-[var(--text)] caret-[var(--text)]`}
                style={{'--text': text}}
            >
                <input
                    type={inputType}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    minLength={minLength}
                    required={required}
                    maxLength={maxLength}
                    className={`input px-[15px] bg-transparent font-[700] placeholder:font-[500] placeholder:text-[var(--text)] placeholder:opacity-70 text-sm w-full h-full outline-none ${type == 'password' && 'mr-8'}`}
                />
                {
                    type == 'password' &&
                        <div className="flex items-center justify-center absolute gap-5 right-[0px] translate-x-[50%] text-2xl cursor-pointer transition-all duration-1000" 
                        onClick={() => setPasswordShow((isPasswordShow) => {
                            setInputType(isPasswordShow ? 'password' : 'text');
                            setIconRotation(iconRotation + 180)
                            return !isPasswordShow;
                        })}
                        style={{rotate: `${iconRotation}deg`, transformOrigin: '100%', color: text}}
                        >
                            <IoMdEye />
                            <IoMdEyeOff />
                        </div>
                }
            </label>
        </>
    )
}