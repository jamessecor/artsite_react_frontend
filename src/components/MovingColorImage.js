import * as React from 'react';
import useIsRotating from '../hooks/useIsRotating';
import './MovingColorImage.css';

const MovingColorImage = ({src, title, isVertical = false, startsWithRotating = false}) => {
    const { isRotating, setIsRotating } = useIsRotating(startsWithRotating);
    const widthOrHeightClass = isVertical ? 'vh-100 w-100' : 'w-100';
    return (
        <img 
            alt={title}
            onClick={() => setIsRotating(!isRotating)}
            className={isRotating ? `${widthOrHeightClass} rotating` : widthOrHeightClass}
            src={src}/>
    )
}

export default MovingColorImage;