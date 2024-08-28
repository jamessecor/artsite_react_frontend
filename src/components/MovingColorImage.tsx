import * as React from 'react';
import { useContext, useState } from 'react';
import './MovingColorImage.css';
import { AlphaPicker } from 'react-color';
import { SettingsContext } from './providers/SettingsProvider';
import { useMutation } from '@tanstack/react-query';
import { IArtwork } from '../models/Artwork';
import axios, { AxiosError } from "axios";

interface IMovingColorImageProps {
    src: string;
    attributes: IArtwork;
    isFullHeightAndWidth?: boolean;
    startsWithRotating?: boolean;
}
const MovingColorImage: React.FC<IMovingColorImageProps> = ({ src, attributes, isFullHeightAndWidth = false, startsWithRotating = false }) => {
    const { title, hueRotationAmount, _id } = attributes;
    const { isRotating } = useContext(SettingsContext);
    const widthOrHeightClass = isFullHeightAndWidth ? 'vh-100 w-100' : 'w-100';

    const [isShowingSlider, setIsShowingSlider] = useState(hueRotationAmount !== 0.0);
    const [hueRotateAmount, setHueRotateAmount] = useState(hueRotationAmount ?? 0.0);

    const { mutate } = useMutation((data: number) => {
        return axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${_id}/hue-rotation-amount`, {
            amount: data
        });
    }, {
        onSuccess: (data) => {
            // let user know they set the value

        }
    });

    const handleChangeComplete = (amount: number) => {
        console.log('in', amount);

        setHueRotateAmount((previousAmount) => {
            if (previousAmount !== amount) {
                mutate(amount);
            }
            return amount;
        });
    };

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
                    onChange={(newColor) => setHueRotateAmount(newColor.rgb.a)}
                    onChangeComplete={(newColor) => handleChangeComplete(newColor.rgb.a)}
                />
            ) : null}
        </React.Fragment>
    );
};

export default MovingColorImage;