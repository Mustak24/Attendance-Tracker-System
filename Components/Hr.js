export default function Hr({children, className="", color='black'}){
    return (
        <div className={`${className} my-5 h-2 rounded-sm`} 
            style={{backgroundImage: `linear-gradient(90deg, ${color}, transparent)`}}
        >
            {children}
        </div>
    )
}