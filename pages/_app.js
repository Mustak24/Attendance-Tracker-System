
import Alert from "@/Components/Alert";
import AppContextProvider from "@/Contexts/AppContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return <>
    <AppContextProvider>
      <Alert/>
      <Component {...pageProps} />;
    </AppContextProvider>
  </> 
}
