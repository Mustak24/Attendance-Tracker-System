export function TypingHeading({className='', speed=100, children}){
    return <>
        <style jsx>{`
            @keyframes animation-0-to-1-opacity-scale{
              0%{opacity: 0; scale: 0;}
              100%{opacity: 1; scale: 1;}
            }
        `}</style>
        <div className={`${className}`}>
            {(String(children)).split('').map((char, index) => <span key={index} className="opacity-0 scale-0 transition-all" style={{
                animation: 'animation-0-to-1-opacity-scale 100ms forwards',
                animationDelay: `${index*speed}ms`
            }}>{char}</span>)}
        </div>
    </> 
}