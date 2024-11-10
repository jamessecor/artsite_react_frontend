import { useState, useEffect, useMemo } from 'react';

const useScreenSize = () => {
    const screenSize = useMemo(() => ({
        width: window.visualViewport?.width ?? window.innerWidth,
        height: window.visualViewport?.height ?? window.innerHeight,
    }), [window.visualViewport, window.innerHeight, window.innerWidth]);

    const isMobile = useMemo(() => screenSize.width < 920, [screenSize.width]);
    const isLandscape = useMemo(() => screenSize.width > screenSize.height, [screenSize.width, screenSize.height]);

    return {
        ...screenSize,
        isMobile,
        isLandscape
    };
};

export default useScreenSize;