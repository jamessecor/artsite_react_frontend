import * as React from "react";
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Spinner } from "react-bootstrap";
import { BackgroundColorContext, textColor } from "../BackgroundColorProvider";
import './Nomophobia.css';
import Canvas from './Canvas';
import PhoneApp from './PhoneApp';
import School from './School';
import News from './News';
import { MdOutlineSchool } from 'react-icons/md';
import { BsFillPencilFill, BsInstagram, BsNewspaper, BsSpotify } from 'react-icons/bs';
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";
import useArtworks from "../../hooks/useArtworks";

export enum Pages {
    Off = 'off',
    Home = 'home',
    Instagram = 'instagram',
    Spotify = 'spotify',
    Canvas = 'canvas',
    School = 'school',
    News = 'news'
}

const Nomophobia = () => {
    const { randomArtwork } = useArtworks();
    const artwork = useMemo(() => randomArtwork(), [randomArtwork]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<Pages>(searchParams.get('p') as Pages ?? Pages.Off);
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
                return <div onClick={() => setCurrentPage(Pages.Home)} className={'phone-screen-off'} />;
                // TODO: add contact
                // return <div className={'phone-screen-off overflow-auto'}><ContactForm /></div>;
            case Pages.Home:
                return (
                    <>
                        <div className={'d-flex justify-content-end p-3'}>
                            <span className={'bg-light py-1 px-2 border border-2 border-dark rounded-pill'}>{currentTime.toLocaleTimeString()}</span>
                        </div>
                        <div className={'d-flex justify-content-between p-3'}>
                            <PhoneApp load={load} page={Pages.Canvas} setCurrentPage={setCurrentPage} icon={<BsFillPencilFill />} />
                            <PhoneApp load={load} page={Pages.Instagram} setCurrentPage={setCurrentPage} icon={<BsInstagram />} />
                            <PhoneApp load={load} page={Pages.Spotify} setCurrentPage={setCurrentPage} icon={<BsSpotify />} />
                            <PhoneApp load={load} page={Pages.School} setCurrentPage={setCurrentPage} icon={<MdOutlineSchool />} />
                        </div>
                        <div className={'d-flex justify-content-between p-3'}>
                            <PhoneApp load={load} page={Pages.News} setCurrentPage={setCurrentPage} icon={<BsNewspaper />} />
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
                return <iframe width={PHONE_WIDTH} height={PHONE_HEIGHT} src="https://open.spotify.com/embed/artist/7yua0uWx5rD0XZOMjgSM6D?utm_source=generator" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>;
            case Pages.School:
                return <School isLoading={isLoading} />;
            case Pages.News:
                return <News />;
            default:
                return <div onClick={() => setCurrentPage(Pages.Home)} className={'phone-screen-off'} />;
        }
    }, [clear, currentTime, isLoading, load]);

    return (
        <BackgroundColorContext.Consumer>
            {({color, setColor}) => (
                <div className={'phone position-absolute top-50 start-50 translate-middle d-flex flex-column'}>
                    <div className={'d-flex justify-content-center align-items-center phone-header'}>
                        <div className={'speaker'} />
                    </div>
                    <div
                        style={{
                            backgroundImage: `linear-gradient(gray, gray), url(${artwork.image})`,
                            backgroundBlendMode: 'saturation'
                        }}
                        className={'justify-content-center p-0 phone-screen'}
                    >
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