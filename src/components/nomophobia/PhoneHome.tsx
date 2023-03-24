import * as React from "react";
import { useEffect, useState } from 'react';
import './Nomophobia.css';
import PhoneApp from './PhoneApp';
import { MdOutlineSchool } from 'react-icons/md';
import { BsFillPencilFill, BsHeartFill, BsInstagram, BsNewspaper, BsSpotify } from 'react-icons/bs';
import { TbBuilding } from 'react-icons/tb';
import { Pages } from "./Nomophobia";

const load = () => 100; // TODO

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
                    <PhoneApp load={load} page={Pages.Likes} routePath={Pages.Likes} icon={<BsHeartFill />} />
                </div>
                <div className={'d-flex justify-content-between p-3'}>
                    <PhoneApp load={load} page={Pages.Canvas} routePath={Pages.Canvas} icon={<BsFillPencilFill />} />
                    <PhoneApp load={load} page={Pages.Instagram} routePath={Pages.Instagram} icon={<BsInstagram />} />
                    <PhoneApp load={load} page={Pages.Spotify} routePath={Pages.Spotify} icon={<BsSpotify />} />
                </div>
                <div className={'d-flex justify-content-between p-3'}>
                    <PhoneApp load={load} page={Pages.SchoolInstructions} routePath={Pages.SchoolInstructions} icon={<MdOutlineSchool />} />
                    <PhoneApp load={load} page={Pages.News} routePath={Pages.News} icon={<BsNewspaper />} />
                    <PhoneApp load={load} page={Pages.GalleryTour} routePath={Pages.GalleryTour} icon={<TbBuilding />} />
                </div>
            </div>
        </div>
    );
}

export default PhoneHome;