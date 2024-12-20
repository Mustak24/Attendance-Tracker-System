import { createContext, useEffect, useState } from "react";

export const _AppContext = createContext()

export default function AppContextProvider({children}){
    const [test, setTest] = useState('test');
    const [alerts, setAlert] = useState([]);


    const states = {
        test, setTest,
        alerts, setAlert,
    }

    useEffect(() => {
        window.ononline = () => {
            setAlert(() => [...alerts ,{msg: 'Conection is come back', type: 'success'}])
        } 
        window.onoffline = () => {
            setAlert(() => [...alerts, {type: 'error', msg: 'Connection is lose'}])
        }
    }, [])


    return <_AppContext.Provider value={states}>
        {children}
    </_AppContext.Provider>
}