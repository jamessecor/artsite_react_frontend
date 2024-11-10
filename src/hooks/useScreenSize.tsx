import { useState, useEffect, useMemo } from 'react';

const useScreenSize = () => {
    const screenSize = useMemo(() => ({
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
    }), [window.visualViewport, window.innerHeight, window.innerWidth]);

    const isMobile = useMemo(() => screenSize.width < 920, [screenSize.width]);

    return {
        ...screenSize,
        isMobile
    };
};

export default useScreenSize;