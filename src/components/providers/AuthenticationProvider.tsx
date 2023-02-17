import * as React from 'react';
import { createContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { RiLogoutBoxLine } from 'react-icons/ri';

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

    const logout = () => {
        sessionStorage.removeItem('artsite-token');
        setIsLoggedIn(false);
    };

    return (
        <AuthenticationContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn }}>
            {isLoggedIn
                ? (
                    <Button variant={'outline-secondary'} onClick={logout} className={'position-fixed bottom-0 start-0 mb-2 ms-2'}>
                        <RiLogoutBoxLine />
                    </Button>
                ) : null}
            {children}
        </AuthenticationContext.Provider>
    );
};

export default AuthenticationProvider;
