import { useState } from 'react';

const useIsShowingInfo = () => {
    const [isShowingInfo, setIsShowingInfo] = useState(false);
    return {
        isShowingInfo,
        setIsShowingInfo
    };
};

export default useIsShowingInfo;