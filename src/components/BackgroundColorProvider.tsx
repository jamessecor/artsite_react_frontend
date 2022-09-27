import * as React from 'react';
import { createContext, useState } from 'react';

interface IBackgroundColor {
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    setColor: React.Dispatch<React.SetStateAction<{ r: number; g: number; b: number; a: number; }>>;
}

export const initialColor = {
    r: 62,
    g: 62,
    b: 62,
    a: 100
};

export const BackgroundColorContext = createContext({
    color: initialColor,
    setColor: () => {}
} as IBackgroundColor);

export const isTooLightForDarkTheme = (r: number, g: number, b: number) => (r + g + b) > 450;

const BackgroundColorProvider = ({ children }) => {
    const [color, setColor] = useState(initialColor);

    React.useEffect(() => console.log('c', color));

    return (
        <BackgroundColorContext.Provider value={{color: color, setColor: setColor}}>
            <div style={{backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}}>
                {children}
            </div>
        </BackgroundColorContext.Provider>
    );
};

export default BackgroundColorProvider;
