import * as React from 'react';
import { useState } from 'react';
import './MovingColorImage.css';
import { ArtworkRotatingContext } from './Navigation';

const MovingColorImage = ({src, title, isFullHeightAndWidth = false, startsWithRotating = false}) => {
    const [isRotating, setIsRotating] = useState(startsWithRotating);
    const widthOrHeightClass = isFullHeightAndWidth ? 'vh-100 w-100' : 'w-100';
    
    // const isActuallyRotating = useMemo(() => isRotatingSetting || isRotating, [isRotatingSetting, isRotating]);
    return (
        <ArtworkRotatingContext.Consumer>
            {(isRotatingSetting) => (
                <img 
                    alt={title}
                    onClick={() => setIsRotating(!isRotating)}
                    className={isRotatingSetting || isRotating ? `${widthOrHeightClass} rotating` : widthOrHeightClass}
                    src={src}/>
            )}
        </ArtworkRotatingContext.Consumer>
    )
}

export default MovingColorImage;