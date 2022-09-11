import * as React from 'react';
import useIsRotating from '../hooks/useIsRotating';
import './MovingColorImage.css';

const MovingColorImage = ({src, title, startsWithRotating = false}) => {
    const { isRotating, setIsRotating } = useIsRotating(startsWithRotating);
    return (
        <img 
            alt={title}
            onClick={() => setIsRotating(!isRotating)}
            className={isRotating ? 'w-100 rotating' : 'w-100'}
            src={src}/>
    )
}

export default MovingColorImage;