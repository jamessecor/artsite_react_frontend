import * as React from 'react';
import { createContext, useState } from 'react';

interface ISettings {
    isShowingInfo: boolean;
    setIsShowingInfo: React.Dispatch<React.SetStateAction<boolean>>;
    isShowingSold: boolean;
    setIsShowingSold: React.Dispatch<React.SetStateAction<boolean>>;
    isRotating: boolean;
    setIsRotating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsContext = createContext({
    isShowingInfo: true,
    setIsShowingInfo: () => { },
    isShowingSold: true,
    setIsShowingSold: () => { },
    isRotating: false,
    setIsRotating: () => { }
} as ISettings);

const SettingsProvider = ({ children }) => {
    const [isShowingInfo, setIsShowingInfo] = useState(true);
    const [isShowingSold, setIsShowingSold] = useState(true);
    const [isRotating, setIsRotating] = useState(false);

    return (
        <SettingsContext.Provider value={{
            isShowingInfo,
            setIsShowingInfo,
            isShowingSold,
            setIsShowingSold,
            isRotating,
            setIsRotating
        }}>
            {children}
        </SettingsContext.Provider>

    );
};

export default SettingsProvider;