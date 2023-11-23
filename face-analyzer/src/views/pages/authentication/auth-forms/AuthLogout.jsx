import { Navigate } from "react-router-dom";

export const    Logout = () => {
    
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate replace to="/login" />;
    };
