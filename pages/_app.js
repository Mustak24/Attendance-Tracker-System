
import Alert from "@/Components/Alert";
import AppContextProvider from "@/Contexts/AppContext";
import "@/styles/globals.css";
import GithubLogo from "@/Components/GithubLogo";
import { PageLoader } from "@/Components/Loader";
import Scrollbar from "@/Components/Scrollbar";
import { useRouter } from "next/router";
import { IoArrowBackCircleOutline } from "react-icons/io5";


export default function App({ Component, pageProps }) {

  const route = useRouter();

  return <>
    <AppContextProvider>
      <Alert/>
      <PageLoader/>
      <Scrollbar/>
      <Component {...pageProps} />
      <GithubLogo className={'fixed bottom-2 right-2'}/>
      <IoArrowBackCircleOutline className="fixed top-1 left-1 size-5 z-[100] cursor-pointer" onClick={() => route.back()} />
    </AppContextProvider>
  </> 
}
