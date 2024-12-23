import { useState, useEffect } from "react";

export default function Scrollbar({color='rgb(0,0,0,.7)'}){

    const [scrollbarHeight, setScrollbarHeight] = useState(0)

    function handelSrollbar(){
        let totalHeight = document.body.scrollHeight - window.innerHeight;
        let scroll = document.body.scrollTop;
        setScrollbarHeight(scroll/totalHeight);
    }

    useEffect(() => {
        document.body.addEventListener('scroll', handelSrollbar);
        return () => removeEventListener('scroll', handelSrollbar)
      }, [])

    return (
        <div 
            className="w-[10px] bg-[var(--text)] opacity-50 fixed left-0 bottom-0 rounded-sm z-[1000]" 
            style={{
                height: `${scrollbarHeight*100}%`,
                '--text': color
            }}
        ></div>
    )
}