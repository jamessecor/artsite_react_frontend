import { useState } from 'react';

const useArtworkSettings = () => {
    const [isRotatingAll, setIsRotatingAll] = useState(false);
    const [isShowingInfoAll, setIsShowingInfoAll] = useState(false);
    return {
        isRotatingAll,
        setIsRotatingAll,
        isShowingInfoAll,
        setIsShowingInfoAll
    };
};

export default useArtworkSettings;