export default function Hr({children, className=""}){
    return (
        <div className={`${className} my-5 h-2 rounded-sm`} 
            style={{backgroundImage: 'linear-gradient(90deg, white, transparent)'}}
        >
            {children}
        </div>
    )
}