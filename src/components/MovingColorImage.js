import * as React from 'react';
import { useState, useMemo } from 'react';
import useArtworkSettings from '../hooks/useArtworkSettings';
import './MovingColorImage.css';

const MovingColorImage = ({src, title, isFullHeightAndWidth = false}) => {
    const { isRotatingAll } = useArtworkSettings();
    const [isRotating, setIsRotating] = useState(isRotatingAll);
    const widthOrHeightClass = isFullHeightAndWidth ? 'vh-100 w-100' : 'w-100';

    React.useEffect(() => console.log('isrotatingall', isRotatingAll), [isRotatingAll]);
    
    const isActuallyRotating = useMemo(() => isRotatingAll || isRotating, [isRotatingAll, isRotating]);
    return (
        <img 
            alt={title}
            onClick={() => setIsRotating(!isRotating)}
            className={isActuallyRotating ? `${widthOrHeightClass} rotating` : widthOrHeightClass}
            src={src}/>
    )
}

export default MovingColorImage;