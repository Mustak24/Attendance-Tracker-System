
import Alert from "@/Components/Alert";
import AppContextProvider from "@/Contexts/AppContext";
import "@/styles/globals.css";
import GithubLogo from "@/Components/GithubLogo";
import { PageLoader } from "@/Components/Loader";


export default function App({ Component, pageProps }) {
  return <>
    <AppContextProvider>
      <Alert/>
      <PageLoader/>
      <Component {...pageProps} />
      <GithubLogo className={'fixed bottom-2 right-2'}/>
    </AppContextProvider>
  </> 
}
