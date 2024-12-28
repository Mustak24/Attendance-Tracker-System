
import Button from "@/Components/Button";
import { TypingHeading } from "@/Components/Heading";
import AutoSlider, { Card } from "@/Components/AutoSlider";
import { _AppContext } from "@/Contexts/AppContext";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { TbCalendarTime } from "react-icons/tb";
import { AiOutlineSafety } from "react-icons/ai";
import { CiExport } from "react-icons/ci";
import verifyUserToken from "@/Functions/users/verifyUserToken";


export default function Home() {

  const router = useRouter()

  async function verify(){
    let {miss, user} = await verifyUserToken(localStorage.getItem('user-token'))
    if(miss) return router.push(`/user/${user.name}`);
  }

  useEffect(() => {
    verify()
  }, [])



  return (
    <main className="w-full min-h-screen overflow-y-scroll select-none text-black bg-white">
      <div className="flex max-sm:flex-col flex-row-reverse justify-between min-h-[470px] relative"> 
        <div className="sm:self-start self-end flex relative top-0 right-0 max-w-[470px] w-full aspect-square">
          <Image height={400} width={400} src={'/index-main.svg'} alt="404" className="absolute top-0 right-0"   />
          <div className="absolute right-4 top-4 sm:text-sm text-xs">
            <Button onClick={() => router.push('/user/login')} text="royalblue">User Login</Button>
          </div>
        </div>

        <TypingHeading className="absolute top-4 sm:left-10 left-5 font-serif font-semibold max-w-[40vw]">Build with ❤️ by @Mustak24</TypingHeading>

        <div className="sm:p-10 sm:pb-0 p-5 flex flex-col flex-1 gap-7 sm:self-center">
          <div className="max-w-[500px] h-fit">
            <TypingHeading  className="text-3xl font-sans my-2">Make Esay Attendance Management</TypingHeading>
            <TypingHeading speed={20} className="text-zinc-700 text-xs font-sans">Effortlessly track and manage attendance for your organization with our user-friendly attendance management system.</TypingHeading>
            <div className="mt-5 flex items-center flex-wrap gap-5">
              <Button text="black" onClick={() => router.push('/organization/login')}>Have a Account</Button>
              <Button text="crimson" onClick={() => router.push('/organization/signup')}>Get Free Account</Button>
            </div>
          </div>
        
          {/* Slider  */}
          <div className="sm:w-[45vw] w-full rounded-lg overflow-hidden shadow-[0_0_10px_rgb(0,0,0,.2)] h-[150px] bg-orange-200 text-center text-sm max-w-[600px]">
            <AutoSlider>
              <Card>
                <ProcessCard 
                  index="01" 
                  heading="Sign up for an account"
                  content="Create your account on our platform to start managing attendance for your organization."
                />
              </Card>
              <Card>
                <ProcessCard 
                  index="02"
                  heading="Set up your organization"
                  content="Enter your organization's details and customize settings according to your requirements."
                />
              </Card>
              <Card>
                <ProcessCard 
                  index="03" 
                  heading="Add Members"
                  content="Invite employees to join the platform and track their attendance effortlessly."
                />
              </Card>
              <Card>
                <ProcessCard 
                  index="04" 
                  heading="Start tracking attendance"
                  content="Use our intuitive tools to monitor and manage attendance records efficiently.."
                />
              </Card>
            </AutoSlider>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-200 p-5 m-5 sm:m-10 rounded-lg">
        <div className="text-center text-2xl font-serif mb-1">Attendance Tracker System</div>
        <div className="text-xs opacity-50 text-center">Simplify the way you track and manage attendance with our user-friendly solution.</div>

        <div className="flex items-center justify-center flex-wrap mt-10 gap-10 [&_.card]:shadow-lg [&_.card]:px-8 [&_.card]:w-[250px] [&_.card]:gap-3 [&_.card]:h-[280px] [&_.card]:flex [&_.card]:items-center [&_.card]:justify-center [&_.card]:flex-col ">
          <div className="card [&_div]:text-center">
            <TbCalendarTime className="size-20 animate-pulse" />
            <div>MEMBERS ATTENDANCE</div>
            <div className="text-xs opacity-50">Track your employee attendance with IP tracking from anywhere and anytime using web.</div>
          </div>

          <div className="card [&_div]:text-center">
            <AiOutlineSafety className="size-20 animate-pulse" />
            <div>SECURE AND ACCURATE</div>
            <div className="text-xs opacity-50">Secure the attendance with IP address lock. Tamperproof attendance data with non editable modes for employees.</div>
          </div>

          <div className="card [&_div]:text-center">
            <CiExport className="size-20 stroke-1 animate-pulse" />
            <div>INTEGRATE OR EXPORT</div>
            <div className="text-xs opacity-50">Integrate your timesheets with third party payroll, attendance and ERP software. Export to Excel, Pdf and other formats.</div>
          </div>
        </div>
      </div>

      <footer className="w-screen relative bg-black text-white p-10 flex flex-wrap gap-20 items-center">
            <div className="flex-1">
                <h1 className="font-serif text-[2em]">Get in Touch</h1>
                <p className="text-pretty">Subscribe to our newsletter for the latest updates on new features and product releases.</p>
                <form className="my-5 flex gap-5 flex-wrap">
                    <input name="email" type="email" placeholder="Enter your Email" className="flex-1 h-10 rounded-full text-center px-5 text-black outline-none border-2 [&:not(:placeholder-shown)]:invalid:border-red-500 [&:not(:placeholder-shown)]:valid:border-green-500" required />
                    <Button innerHTML='Subscribe' className='border-2 w-[150px]' />
                </form>
            </div>

            <div className="flex flex-col items-center gap-3 p-5 text-sm w-[300px] flex-1">
              <Button className="w-24 border-2 left-[-50px]" onClick={() => router.push('/login')}>Login</Button>
              <Button className="w-24 border-2 left-[0px]">FAQs</Button>
              <Button className="w-24 border-2 left-[50px]" onClick={() => router.push('/organization/signup')}>Signup</Button>
            </div>  
      </footer>
    </main>
  );
}


function ProcessCard({heading='Heading', index='00', content='Content ...'}){
  return(
    <div className='bg-orange-200 flex flex-col justify-around rounded-md w-full min-h-[150px] sm:p-5 p-2'>
      <div className="flex w-full items-center justify-between gap-10 sm:text-3xl text-2xl">
        <div className="leading-10 font-serif text-start">{heading}</div>
        <div className="">{index}</div>
      </div>
      <p className="text-start w-full font-sans">{content}</p>
    </div>
  )
}