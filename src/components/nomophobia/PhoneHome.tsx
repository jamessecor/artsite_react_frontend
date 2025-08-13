import * as React from "react";
import { useEffect, useState } from 'react';
import './Nomophobia.css';
import PhoneApp from './PhoneApp';
import { MdOutlineSchool } from 'react-icons/md';
import { BsCameraVideo, BsFillPencilFill, BsHeartFill, BsInstagram, BsNewspaper, BsPaletteFill, BsSpotify } from 'react-icons/bs';
import { TbBuilding } from 'react-icons/tb';
import { Pages } from "./Nomophobia";

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
                    <PhoneApp page={Pages.Likes} routePath={Pages.Likes} icon={BsHeartFill} />
                    <PhoneApp page={Pages.Video} routePath={Pages.Video} icon={BsCameraVideo} />
                    <PhoneApp page={Pages.Colors} routePath={Pages.Colors} icon={BsPaletteFill} />
                </div>
                <div className={'d-flex justify-content-between p-3'}>
                    <PhoneApp page={Pages.Canvas} routePath={Pages.Canvas} icon={BsFillPencilFill} />
                    <PhoneApp page={Pages.Instagram} routePath={Pages.Instagram} icon={BsInstagram} />
                    <PhoneApp page={Pages.Spotify} routePath={Pages.Spotify} icon={BsSpotify} />
                </div>
                <div className={'d-flex justify-content-between p-3'}>
                    <PhoneApp page={Pages.SchoolInstructions} routePath={Pages.SchoolInstructions} icon={MdOutlineSchool} />
                    <PhoneApp page={Pages.News} routePath={Pages.News} icon={BsNewspaper} />
                    <PhoneApp page={Pages.GalleryTour} routePath={Pages.GalleryTour} icon={TbBuilding} />
                </div>
            </div>
        </div>
    );
}

export default PhoneHome;