import React, { useEffect } from 'react';
import config from '../config.json'
import useIsRotating from '../hooks/useIsRotating';
import './MovingColorImage.css';

const MovingColorImage = ({src, title}) => {
    const { isRotating, setIsRotating } = useIsRotating();
    return (
        <img 
            alt={title}
            onClick={() => setIsRotating(!isRotating)}
            className={isRotating ? 'w-100 rotating' : 'w-100'}
            // style={{filter: 'hue-rotate(' + this.state.rotationAmount + 'deg)'}}
            src={`${config.host}${src}`}/>
    )
}

export default MovingColorImage;