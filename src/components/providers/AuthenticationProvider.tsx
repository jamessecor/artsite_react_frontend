import * as React from 'react';
import { createContext, useState } from 'react';

interface IAuthentication {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthenticationContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {}
} as IAuthentication);

const AuthenticationProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(sessionStorage.getItem('artsite-token')));

    return (
        <AuthenticationContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export default AuthenticationProvider;
