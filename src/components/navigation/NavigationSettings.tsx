import * as React from 'react';
import { useState, createContext, useContext } from 'react';
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs';
import { SketchPicker, HuePicker } from 'react-color';
import { BackgroundColorContext } from '../providers/BackgroundColorProvider';
import { Badge, Nav } from "react-bootstrap";
import './Navigation.css';
import useScreenSize from '../../hooks/useScreenSize';
import { SettingsContext } from '../providers/SettingsProvider';

const NavigationSettings = () => {
    const { color, setColor } = useContext(BackgroundColorContext);
    const { isShowingInfo, setIsShowingInfo, isShowingSold, setIsShowingSold, isRotating, setIsRotating } = useContext(SettingsContext);
    const { isMobile } = useScreenSize();
    const [isUsingColorSelector, setIsUsingColorSelector] = useState(false);

    return (
        <Nav className={'mt-2 p-2 border rounded border-3 border-secondary'}>
            <div className={'text-center'}>
                <Badge pill={true} className={'bg-secondary w-100'}>
                    {'Settings'}
                </Badge>
            </div>
            <Nav.Link className={'py-0 no-hover'} onClick={() => setIsShowingInfo(!isShowingInfo)}>
                <div className={'d-flex align-items-center'}>
                    <h3 className={'mb-1 pe-2'}>{isShowingInfo ? <BsToggle2On /> : <BsToggle2Off />}</h3>
                    {'Show Artwork Info'}
                </div>
            </Nav.Link>
            <Nav.Link className={'py-0 no-hover'} onClick={() => setIsShowingSold(!isShowingSold)}>
                <div className={'d-flex align-items-center'}>
                    <h3 className={'mb-1 pe-2'}>{isShowingSold ? <BsToggle2On /> : <BsToggle2Off />}</h3>
                    {' Show Sold Artworks'}
                </div>
            </Nav.Link>
            <Nav.Link className={'py-0 no-hover'} onClick={() => setIsRotating(!isRotating)}>
                <div className={'d-flex align-items-center'}>
                    <h3 className={'mb-1 pe-2'}>{isRotating ? <BsToggle2On /> : <BsToggle2Off />}</h3>
                    {' Wild Colors'}
                </div>
            </Nav.Link>
            <Nav.Link className={'py-0 no-hover'} onClick={() => setIsUsingColorSelector(!isUsingColorSelector)}>
                <div className={'d-flex align-items-center'}>
                    <h3 className={'mb-1 pe-2'}>{isUsingColorSelector ? <BsToggle2On /> : <BsToggle2Off />}</h3>
                    {' Select Background Color'}
                </div>
            </Nav.Link>
            {
                isUsingColorSelector
                    ? (
                        <SketchPicker
                            className={'mt-1 align-self-center'}
                            color={color}
                            onChange={(newColor) => setColor(newColor.rgb)}
                            onChangeComplete={(newColor) => setColor(newColor.rgb)}
                        />
                    )
                    : null}

            {
                isUsingColorSelector && isMobile
                    ? (
                        <HuePicker
                            className={'mt-1 align-self-center'}
                            color={color}
                            onChange={(newColor) => setColor(newColor.rgb)}
                            onChangeComplete={(newColor) => setColor(newColor.rgb)}
                        />
                    )
                    : null}
        </Nav>
    );
};

export default NavigationSettings;