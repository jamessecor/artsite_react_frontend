import { useState } from 'react';

const useIsRotating = (startsWithRotating = false) => {
    const [isRotating, setIsRotating] = useState(startsWithRotating);
    return {
        isRotating,
        setIsRotating
    };
};

export default useIsRotating;