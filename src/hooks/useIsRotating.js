import { useState } from 'react';

const useIsRotating = () => {
    const [isRotating, setIsRotating] = useState(false);
    return {
        isRotating,
        setIsRotating
    };
};

export default useIsRotating;