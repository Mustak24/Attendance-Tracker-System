
import { useEffect, useRef, useState } from "react"


export default function AutoSlider({children, speed=5, effectTime=500, color='white', size=20}){

    const [effectBoxs, setEffectBoxs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const effectBox = useRef(null);

    function delay(time){
        return new Promise(res => {
            setTimeout(() => {
                res(true);
            }, time);
        });
    }

    async function sliderEffect(){
        if(!effectBox.current) return;
        effectBox.current.style.scale = 1;
        effectBox.current.childNodes.forEach(async e => {
                e.style.scale = 1;
                e.style.opacity = 1;
                setTimeout(() => {
                    e.style.scale = 0;
                    e.style.opacity = .5;
                }, effectTime + 1100)
        })
        await delay((effectTime+1050)*2 );
        effectBox.current.style.scale = 0;
    }

    async function handelSliding(){
        sliderEffect();
        await delay(effectTime + 1000);
        setActiveIndex(pre => (pre+1)%children.length);
    }

    useEffect(() => {

        handelEffectBoxs();
        window.addEventListener('resize', handelEffectBoxs);

        const interval = setInterval(() => {
            handelSliding();
        }, (1000*speed))

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handelEffectBoxs);
        }
    }, []);

    function handelEffectBoxs(){
        if(!effectBox.current) return;
        let height = effectBox.current.offsetHeight;
        let width = effectBox.current.offsetWidth;
        let pixels = Math.round((width*height)/(size*size));
        return setEffectBoxs(Array.from({length: pixels}).map(_ => Math.random()));
    }

    useEffect(() => {
        handelEffectBoxs();
    }, [effectBox.current, size])

    return (<>
        <div className="w-full h-full flex items-center relative overflow-hidden">
            <div className="hidden">{children[(activeIndex+1)%children.length]}</div>
                {children[activeIndex]}
                <div ref={effectBox} className="effect z-2 absolute w-full h-full flex flex-wrap overflow-hidden" style={{scale: 0}}>
                {
                    effectBoxs.map((delay,i) => {
                        return(
                            <div 
                                key={i} 
                                className="aspect-square flex-1" 
                                style={{
                                    transition: `all ${effectTime}ms ${delay}s`,
                                    backgroundColor: color,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    opacity: 0,
                                    scale: 0
                                }}
                            ></div>
                        )
                    })
                }
                </div>
        </div>
    </>)
}

export function Card({children, className}){
    return (<div className={className}>
            {children}
    </div>)
}