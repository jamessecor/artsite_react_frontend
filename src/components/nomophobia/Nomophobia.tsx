import * as React from "react";
import { useCallback, useEffect, useState } from 'react';
import { Button, Spinner } from "react-bootstrap";
import { BackgroundColorContext, textColor } from "../BackgroundColorProvider";
import './Nomophobia.css';
import Canvas from './Canvas';
import PhoneApp from './PhoneApp';
import School from './School';
import { MdOutlineSchool } from 'react-icons/md';
import { BsFillPencilFill, BsInstagram, BsSpotify } from 'react-icons/bs';
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";

export enum Pages {
    Off = 'off',
    Home = 'home',
    Instagram = 'instagram',
    Spotify = 'spotify',
    Canvas = 'canvas',
    School = 'school'
}

const Nomophobia = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<Pages>(Pages.Off);
    const [clear, setClear] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        var timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        };
    }, []);

    const load = useCallback((timeToLoad: number) => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), timeToLoad);
    }, []);

    const getPhoneApp = useCallback((currentPage: Pages) => {
        switch (currentPage) {
            case Pages.Off:
                return <div className={'phone-screen-off'} />;
            case Pages.Home:
                return (
                    <>
                        <div className={'d-flex justify-content-end p-3'}>
                            <span className={'py-1 px-2 border border-2 border-dark rounded-pill'}>{currentTime.toLocaleTimeString()}</span>
                        </div>
                        <div className={'d-flex justify-content-between p-3'}>
                            <PhoneApp load={load} page={Pages.Canvas} setCurrentPage={setCurrentPage} icon={<BsFillPencilFill />} />
                            <PhoneApp load={load} page={Pages.Instagram} setCurrentPage={setCurrentPage} icon={<BsInstagram />} />
                            <PhoneApp load={load} page={Pages.Spotify} setCurrentPage={setCurrentPage} icon={<BsSpotify />} />
                            <PhoneApp load={load} page={Pages.School} setCurrentPage={setCurrentPage} icon={<MdOutlineSchool />} />
                        </div>
                    </>
                );
            case Pages.Canvas:
                return <Canvas
                    isLoading={isLoading}
                    clear={clear}
                    setClear={setClear}
                    height={PHONE_HEIGHT}
                    width={PHONE_WIDTH}
                    />;
            case Pages.Instagram:
                return <iframe height={PHONE_HEIGHT} width={PHONE_WIDTH} src="https://www.instagram.com/jamessecor/embed"></iframe>;
            case Pages.Spotify:
                return <iframe src="https://open.spotify.com/embed/artist/7yua0uWx5rD0XZOMjgSM6D?utm_source=generator" width={PHONE_WIDTH} height={PHONE_HEIGHT} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>;
            case Pages.School:
                return <School isLoading={isLoading} />;
            default:
                return null;
        }
    }, [clear, currentTime, isLoading, load]);

    return (
        <BackgroundColorContext.Consumer>
            {({color, setColor}) => (
                <div className={'phone position-absolute top-50 start-50 translate-middle d-flex flex-column'}>
                    <div className={'d-flex justify-content-center align-items-center phone-header'}>
                        <div className={'speaker'} />
                    </div>
                    <div className={'justify-content-center p-0 phone-screen'}>
                        { isLoading
                            && (
                                <div style={{zIndex: 10000}} className={'position-absolute top-50 start-50 translate-middle '}>
                                    <Spinner variant={'info'} animation={'border'} />
                                </div>
                            )}
                        {getPhoneApp(currentPage)}
                    </div>
                    <div className={'d-flex justify-content-center align-items-center phone-footer'}>
                        <Button
                            className={'btn btn-dark phone-bottom-button'}
                            onClick={() => setCurrentPage(Pages.Home)} 
                        />
                    </div>
                </div>
            )}
        </BackgroundColorContext.Consumer>
    )
}

export default Nomophobia;