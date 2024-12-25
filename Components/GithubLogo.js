import { IoLogoGithub } from "react-icons/io";

export default function GithubLogo({url='https://github.com/Mustak24/Hostel', className}){
    return (
        <button onClick={() => window.open(url, '_blank')} className={`${className} group flex items-center justify-center gap-2 shadow-[0_0_5px_rgb(0,0,0,.3)] rounded-md overflow-hidden bg-[rgb(255,255,255,.4)]`}>
            <IoLogoGithub className="size-6 text-black bg-[rgb(255,255,255,.4)] p-1 box-content" />
            <div className="max-sm:invisible absolute whitespace-nowrap bottom-[110%] right-0 rounded-md shadow-[0_0_5px_rgb(0,0,0,.2)] group-hover:block hidden text-xs px-2 py-1 bg-[rgb(255,255,255,.6)]">Git-Hub</div>
        </button>
    )
}