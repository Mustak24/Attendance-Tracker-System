import { _AppContext } from "@/Contexts/AppContext";
import { useContext, useEffect, useRef } from "react"


export default function Alert() {
    const {alerts} = useContext(_AppContext)
    
    return (<div className="flex flex-col-reverse h-fit w-fit overflow-y-scroll overflow-x-visible [&_div]:shrink-0 gap-1 absolute bottom-[50px] left-2 z-[1000] cursor-default">
        {(alerts || []).map((alert, i) => <AlertCard key={i} info={alert} />)}
    </div>)
}


export function AlertCard({info}) {
    const alertBox = useRef(null);
    const cardTypes = {
        success: { afterBorder: 'after:border-green-500', text: 'text-green-500', bg: 'bg-[rgb(255,255,255,.1)]' },
        info: { afterBorder: 'after:border-black', text: 'text-black', bg: 'bg-[rgb(0,0,0,.1)]' },
        error: { afterBorder: 'after:border-red-500', text: 'text-red-500', bg: 'bg-[rgb(239,68,68,.1)]' },
    }
    useEffect(() => {
        if(!alertBox.current) return;
        setTimeout(() => {
            if(!alertBox.current) return;
            alertBox.current.classList.replace('opacity-0', 'opacity-1')
            alertBox.current.classList.replace('scale-[.8]', 'scale-1')
            alertBox.current.classList.replace('after:h-0', 'after:h-full')
            setTimeout(() => {
                if(!alertBox.current) return;
                alertBox.current.classList.replace('opacity-1', 'opacity-[.8]')
                alertBox.current.classList.replace('scale-1', 'scale-0')
                alertBox.current.classList.add('invisible')
                setTimeout(() => { 
                    alertBox.current.remove() 
                }, 500)
            }, 4000)
        }, 100)
    }, [])

    return (<>
        <div ref={alertBox} className={`w-[250px] h-16 scale-[.8] opacity-0 transition-all duration-500 relative flex flex-col backdrop-blur-sm rounded-sm p-2 overflow-hidden after:content-[''] after:absolute after:translate-y-[-50%] after:top-[50%] after:left-0 after:duration-[3s] after:transition-all after:ease-linear after:h-0 after:border-2 ${cardTypes[info.type]?.afterBorder || ''} ${cardTypes[info.type]?.bg || ''} ${cardTypes[info.type]?.text || ''}`}>
            <p className="text-sm font-sans line-clamp-2 text-pretty font-semibold">{info?.msg || ''}</p>
        </div>
    </>)
}