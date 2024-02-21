import { createContext, useEffect, useState } from "react";
import { apiLoggedInInstance } from "../utils/api";

export const userContext = createContext({})

export const UserProvider = ({children}) => {
    const [user, setUser] = useState();

    const handleLogout = () => {
        setUser(null);
    }

    useEffect(() => {
        // apiLoggedInInstance({
        //     url: '/api/auth/user-info'
        // }).then(response => {
        //     setUser(response.data);
        // })
    }, [])

    return (
        <userContext.Provider value={{user, setUser, handleLogout}}>
            {children}
        </userContext.Provider>
    )
}