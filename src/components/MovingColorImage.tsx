import * as React from 'react';
import { useState } from 'react';
import './MovingColorImage.css';
import { AlphaPicker } from 'react-color';
import { SettingsContext } from './providers/SettingsProvider';

const MovingColorImage = ({src, title, isFullHeightAndWidth = false, startsWithRotating = false}) => {
    // const screenWidth = window.innerWidth;
    const widthOrHeightClass = isFullHeightAndWidth ? 'vh-100 w-100' : 'w-100';
    
    const [isShowingSlider, setIsShowingSlider] = useState(false);
    const [hueRotateAmount, setHueRotateAmount] = useState(0.0);
    
    return (
        <SettingsContext.Consumer>
            {({ isRotating }) => (
                <React.Fragment>
                    <img
                        alt={title}
                        style={{ filter: `hue-rotate(${hueRotateAmount * 360}deg)` }}
                        onClick={() => setIsShowingSlider(!isShowingSlider)}
                        className={startsWithRotating || isRotating ? `${widthOrHeightClass} rotating` : widthOrHeightClass}
                        src={src}/>
                    {isShowingSlider ? (
                        <AlphaPicker
                            className={'w-100'}
                            color={{ a: hueRotateAmount }}
                            onChange={(newColor) => setHueRotateAmount(newColor.rgb.a)}
                            onChangeComplete={(newColor) => setHueRotateAmount(newColor.rgb.a)}
                        />
                    ) : null}
                </React.Fragment>
            )}
        </SettingsContext.Consumer>
    )
}

export default MovingColorImage;