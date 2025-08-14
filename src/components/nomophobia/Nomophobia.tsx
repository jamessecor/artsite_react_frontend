import * as React from "react";
import { useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";
import { BackgroundColorContext } from "../providers/BackgroundColorProvider";
import './Nomophobia.css';

export enum Pages {
    Off = 'off',
    Home = 'home',
    Instagram = 'instagram',
    Video = 'video',
    Spotify = 'spotify',
    Canvas = 'canvas',
    SchoolInstructions = 'school-instructions',
    School = 'school',
    News = 'news',
    GalleryTour = 'gallery-tour',
    Likes = 'likes',
    Colors = 'colors'
};

const Nomophobia = () => {
    const { color } = useContext(BackgroundColorContext);
    const navigateTo = useNavigate();

    const location = useLocation();
    const isPhoneOff = location.pathname.endsWith('/off') || location.pathname.endsWith('/nomophobia') || location.pathname.endsWith('/nomophobia/');

    return (
        <React.Fragment>
            <div
                style={{
                    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                    height: '100vh'
                }}
            >
            </div>
            {/* PHONE */}
            <div
                className={'my-4 phone position-absolute top-50 start-50 translate-middle d-flex flex-column'}
            >
                {/* POWER BUTTON */}
                <Button
                    className={'power-button position-absolute m-0 p-0 end-0 top-0'}
                    onClick={() => navigateTo(/nomophobia[^a-z]*$/i.test(window.location.pathname) ? `/nomophobia/${Pages.Home}` : '/nomophobia')}
                />
                {/* SPEAKER */}
                <div className={'d-flex justify-content-center align-items-center phone-header'}>
                    <div className={'speaker'} />
                </div>
                {/* PHONE SCREEN */}
                <div className={'justify-content-center p-0 phone-screen' + (isPhoneOff ? ' phone-screen-off' : '')}>
                    <Outlet />
                </div>
                {/* BOTTOM BUTTON */}
                <div className={'d-flex justify-content-center align-items-center phone-footer'}>
                    <Button
                        className={'btn btn-dark phone-bottom-button'}
                        onClick={() => navigateTo('/nomophobia/home')}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Nomophobia;