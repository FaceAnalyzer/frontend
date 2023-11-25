import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
    // State to hold the authentication token
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [user, setUser_] = useState(JSON.parse(localStorage.getItem("user")));

    // Function to set the authentication token
    const setToken = (newToken) => {
        setToken_(newToken);
    };

    const setUser = (newUser) => {
        setUser_(newUser);
    };

    useEffect(() => {
        if(localStorage.getItem('token')){
            axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem('token');
        }
    }, []);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem('token',token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem('token')
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            //console.log("user", user);
            //Temporary hacky fix
            localStorage.setItem('user', JSON.stringify(user).replaceAll("\\",""));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Memoized value of the authentication context
    const contextValue = useMemo(
        () => ({
            token,
            user,
            setToken,
            setUser,
        }),
        [token, user]
    );

    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return authContext;
};

export default AuthProvider;
