import * as React from 'react';
import { useState } from 'react';
import './MovingColorImage.css';
import { ArtworkRotatingContext } from './Navigation';
import { AlphaPicker } from 'react-color';

const MovingColorImage = ({src, title, isFullHeightAndWidth = false, startsWithRotating = false}) => {
    // const screenWidth = window.innerWidth;
    const widthOrHeightClass = isFullHeightAndWidth ? 'vh-100 w-100' : 'w-100';
    
    const [isRotating, setIsRotating] = useState(false);
    const [hueRotateAmount, setHueRotateAmount] = useState(0.0);
    
    return (
        <ArtworkRotatingContext.Consumer>
            {(isRotatingSetting) => (
                <React.Fragment>
                    <img
                        alt={title}
                        style={{ filter: `hue-rotate(${hueRotateAmount * 360}deg)` }}
                        onClick={() => setIsRotating(!isRotating)}
                        className={startsWithRotating || isRotatingSetting ? `${widthOrHeightClass} rotating` : widthOrHeightClass}
                        src={src}/>
                    {isRotating ? (
                        <AlphaPicker
                            className={'w-100'}
                            color={{ a: hueRotateAmount }}
                            onChange={(newColor) => setHueRotateAmount(newColor.rgb.a)}
                            onChangeComplete={(newColor) => setHueRotateAmount(newColor.rgb.a)}
                        />
                    ) : null}
                </React.Fragment>
            )}
        </ArtworkRotatingContext.Consumer>
    )
}

export default MovingColorImage;