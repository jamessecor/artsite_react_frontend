import * as React from "react";
import { useCallback, useMemo, useEffect, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Spinner } from "react-bootstrap";
import { BackgroundColorContext, textColor } from "../providers/BackgroundColorProvider";
import './Nomophobia.css';
import Canvas from './Canvas';
import PhoneApp from './PhoneApp';
import School from './School';
import News from './News';
import GalleryTour from './GalleryTour';
import { MdOutlineSchool } from 'react-icons/md';
import { BsFillPencilFill, BsInstagram, BsNewspaper, BsSpotify } from 'react-icons/bs';
import { HiBuildingLibrary } from 'react-icons/hi2'
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";
import useArtworks from "../../hooks/useArtworks";
import SchoolInstructions from "./SchoolInstructions";
import { chirpingInTheThicketsTour } from "../../data/gallery-tour/chirping-in-the-thickets";
import { Pages } from "./Nomophobia";

const load = () => 0; // TODO

const PhoneHome = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        var timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={'h-100 d-flex flex-column justify-content-between'}>
            <div className={'d-flex justify-content-end p-3'}>
                <span className={'py-1 px-2 border border-2 border-light text-light rounded-pill'}>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div>
                <div className={'d-flex justify-content-between p-3'}>
                    <PhoneApp load={load} page={Pages.Canvas} routePath={Pages.Canvas} icon={<BsFillPencilFill />} />
                    <PhoneApp load={load} page={Pages.Instagram} routePath={Pages.Instagram} icon={<BsInstagram />} />
                    <PhoneApp load={load} page={Pages.Spotify} routePath={Pages.Spotify} icon={<BsSpotify />} />
                </div>
                <div className={'d-flex justify-content-between p-3'}>
                    <PhoneApp load={load} page={Pages.SchoolInstructions} routePath={Pages.SchoolInstructions} icon={<MdOutlineSchool />} />
                    <PhoneApp load={load} page={Pages.News} routePath={Pages.News} icon={<BsNewspaper />} />
                    <PhoneApp load={load} page={Pages.GalleryTour} routePath={Pages.GalleryTour} icon={<HiBuildingLibrary />} />
                </div>
            </div>
        </div>
    );
}

export default PhoneHome;