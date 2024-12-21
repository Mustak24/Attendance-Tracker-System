export default function ShowIf({when=true, children, loading=false, loadingText='', loaderSize='20px'}) {
    return<>{
        when ? (
            children
        ) : (
            !loading ? null : (
                <div className="flex items-center justify-center flex-col relative">
                    <div className="aspect-square border-[6px] border-t-transparent border-black animate-spin rounded-full" style={{width: loaderSize}}></div>
                    <div className="text-xs font-sans font-bold">{loadingText}</div>
                </div>
            )
        )
    }</> 
}

export function ShowIfElse({when=true, children, Else=null}){
    return <>
        {when ? children : Else}
    </>
}