import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  // Function to set the authentication token
  const setToken = (newToken, role) => {
    setToken_(newToken);
    setUserRole(role);
  };


  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token',token);
      localStorage.setItem('userRole',userRole);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }
  }, [token, userRole]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      userRole,
      setUserRole
    }),
    [token, userRole]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
