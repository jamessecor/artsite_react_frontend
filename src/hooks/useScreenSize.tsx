import { useState, useEffect, useMemo } from 'react';

const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const isMobile = useMemo(() => screenSize.width < 920, [screenSize.width]);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        ...screenSize,
        isMobile
    };
};

export default useScreenSize;