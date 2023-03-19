import * as React from "react";
import { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Spinner } from "react-bootstrap";
import { BackgroundColorContext } from "../providers/BackgroundColorProvider";
import './Nomophobia.css';

export enum Pages {
    Off = 'off',
    Home = 'home',
    Instagram = 'instagram',
    Spotify = 'spotify',
    Canvas = 'canvas',
    SchoolInstructions = 'school-instructions',
    School = 'school',
    News = 'news',
    GalleryTour = 'gallery-tour'
};

const Nomophobia = () => {
    const navigateTo = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const load = useCallback((timeToLoad: number) => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), timeToLoad);
    }, []);

    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                // PHONE
                <div className={'my-4 phone position-absolute top-50 start-50 translate-middle d-flex flex-column'}>
                    {/* POWER BUTTON */}
                    <Button
                        className={'power-button position-absolute m-0 p-0 end-0 top-0'}
                        onClick={() => navigateTo(/nomophobia[^a-z]$/i.test(window.location.pathname) ? Pages.Home : '')}
                    />
                    {/* SPEAKER */}
                    <div className={'d-flex justify-content-center align-items-center phone-header'}>
                        <div className={'speaker'} />
                    </div>
                    {/* PHONE SCREEN */}
                    <div
                        className={'justify-content-center p-0 phone-screen'}
                        style={{
                            // boxShadow: currentPage === Pages.Off ? '' : '0px 0px 25px 10px rgba(205, 255, 205, 0.3)',
                            background: 'lightblue'
                        }}
                    >
                        {isLoading
                            && (
                                <div className={'position-absolute top-50 start-50 translate-middle '}>
                                    <Spinner variant={'info'} animation={'border'} />
                                </div>
                            )}
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
            )}
        </BackgroundColorContext.Consumer>
    )
}

export default Nomophobia;