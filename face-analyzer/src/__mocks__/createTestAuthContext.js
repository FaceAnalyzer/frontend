import React, {createContext, useContext} from 'react';

export const createTestAuthContext = (value) => {
    const AuthContext = createContext(undefined);
    const useAuth = () => {
        const authContext = useContext(AuthContext);
        if (!authContext) {
            throw new Error('glglgllgl');
        }
        return authContext;
    };
    const AuthProvider = ({children}) => (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );

    return {AuthProvider, useAuth};
};