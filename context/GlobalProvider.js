import { getCurrentUser } from "lib/appwrite";
import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })

            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);
    return (
        <GlobalContext.Provider 
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                loading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;
