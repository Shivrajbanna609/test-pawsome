import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendurl = 'http://localhost:4000';
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    // Stable function for fetching user data
    const getUserData = useCallback(async () => {
        try {
            const { data } = await axios.get(backendurl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [backendurl]);

    // Stable function for checking auth state
    const getAuthState = useCallback(async () => {
        try {
            const { data } = await axios.get(backendurl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [backendurl, getUserData]);

    // Call getAuthState on component mount
    useEffect(() => {
        getAuthState();
    }, [getAuthState]);

    const value = {
        backendurl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
