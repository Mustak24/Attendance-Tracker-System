import { set } from "mongoose";
import { useState, useEffect } from "react";
import { TypingHeading } from "./Heading";

export default function Clock(){
    
    const [clockSecPin, setClockSecPin] = useState(0);
    const [clockMinPin, setClockMinPin] = useState(0);
    const [clockHrPin, setClockHrPin] = useState(0);
    const [clockDay, setClockDay] = useState('');

    function handleClock(){
        let time = new Date();
        let [miliSec ,sec, min, hr] = [time.getMilliseconds() ,time.getSeconds(), time.getMinutes(), time.getHours()];
        setClockSecPin(sec*6 + 0.006*miliSec - 90);
        setClockMinPin(min*6 + sec*0.1 - 90);
        setClockHrPin(hr*30 + min*0.5 - 90);  
    }
    
    useEffect(() => {
        setClockDay(new Date().toLocaleDateString());
        let interval = setInterval(() => handleClock(), 1);
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="aspect-square w-[80vmin] max-w-[400px] flex items-center justify-center">
            <div className="clock relative aspect-square w-[50vmin] max-w-[250px] flex items-center justify-center">
            
            {
                ['4s', '6s'].map(dur => 
                    <div 
                        key={dur} 
                        className="clock-body absolute aspect-[0.95] w-[80vmin] max-w-[400px] rounded-[50%] bg-[rgba(0,217,255,0.5)] animate-spin" 
                        style={{animationDuration: dur}}>
    
                        </div>
                )
            }

            <div className="clock-numbers absolute flex text-white items-center justify-center w-full h-full">
                {
                    [1,2,3,4,5,6,7,8,9,10,11,12].map(num => {
                        return (
                            <span key={`clock-number-${num}`} className="absolute w-full h-full" style={{rotate: `${45 + num * 30}deg`}}>
                                <span className="absolute font-serif md:text-2xl" style={{rotate: `-${45 + num * 30}deg`}}>{num}</span>
                            </span>
                        )
                    })
                }
            </div>

            <div className="clock-day-display absolute text-white text-md font-mono font-semibold px-2 h-6 flex items-center justify-center -translate-y-[200%] rounded-md text-sm">
                <TypingHeading speed={200}>
                    {clockDay.split('/').join(' / ')}
                </TypingHeading>
            </div>  

            <div className="absolute clock-center-bot aspect-square w-2 rounded-full bg-white"></div>

            <div 
                style={{rotate: `${clockSecPin}deg`}} 
                className="absolute w-[50%] border-[3px] border-white opacity-50 rounded-[0%_50%_50%_0%] translate-x-[50%]">
            </div>

            <div 
                style={{rotate: `${clockMinPin}deg`}} 
                className="absolute w-[40%] border-[3px] border-white opacity-50 rounded-[0%_50%_50%_0%] translate-x-[50%]">
            </div>
            
            <div 
                style={{rotate: `${clockHrPin}deg`}} 
                className="absolute w-[30%] border-[3px] border-white opacity-50 rounded-[0%_50%_50%_0%] translate-x-[50%]">
            </div>
        
      

        </div>
    </div>
    )
}