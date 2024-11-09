import * as React from 'react';
import { useContext, useState } from 'react';
import './MovingColorImage.css';
import { AlphaPicker } from 'react-color';
import { SettingsContext } from './providers/SettingsProvider';

const MovingColorImage = ({ src, title, isFullHeightAndWidth = false, startsWithRotating = false }) => {
    const { isRotating } = useContext(SettingsContext);
    const widthOrHeightClass = isFullHeightAndWidth ? 'vh-100 w-100' : 'w-100';

    const [isShowingSlider, setIsShowingSlider] = useState(false);
    const [hueRotateAmount, setHueRotateAmount] = useState(0.0);

    return (
        <React.Fragment>
            <img
                alt={title}
                style={{ filter: `hue-rotate(${hueRotateAmount * 360}deg)` }}
                onClick={() => setIsShowingSlider(!isShowingSlider)}
                className={startsWithRotating || isRotating ? `${widthOrHeightClass} rotating` : widthOrHeightClass}
                src={src} />
            {isShowingSlider ? (
                <AlphaPicker
                    className={'w-100'}
                    color={{ a: hueRotateAmount }}
                    onChange={(newColor) => setHueRotateAmount(newColor.rgb.a ?? 0.0)}
                    onChangeComplete={(newColor) => setHueRotateAmount(newColor.rgb.a ?? 0.0)}
                />
            ) : null}
        </React.Fragment>
    );
};

export default MovingColorImage;