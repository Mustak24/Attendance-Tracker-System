import { useRef, useEffect } from "react"
import { useRouter } from "next/router"


export function PageLoader({color='black'}){

    const router = useRouter()
    const Loader = useRef()
    
    useEffect(()=>{
        router.events.on('routeChangeStart', ()=>{
          if(!Loader?.current) return;
          Loader.current.style.display = 'block'
          setTimeout(()=>{
            if(!Loader?.current) return;
            Loader.current.style.transition = 'all 8s'
            Loader.current.style.width = '80%';
          },1)
        })
        router.events.on('routeChangeComplete', ()=>{
            setTimeout(() => {
              if(!Loader?.current) return;
                Loader.current.style.transition = 'all .1s'
                Loader.current.style.width = '100%';   
                setTimeout(()=>{
                  if(!Loader?.current) return;
                    Loader.current.style.display = 'none'
                    Loader.current.style.width = '0%'
                },100)
            });
        })
      },[])

    return <div ref={Loader} className="w-0 h-1 opacity-70 fixed top-0 left-0 rounded-full z-[1500]" style={{backgroundColor: color}}></div>
}