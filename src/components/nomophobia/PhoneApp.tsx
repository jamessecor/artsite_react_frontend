import * as React from 'react';
import { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import './PhoneApp.css';
import { Pages } from './Nomophobia';

interface PhoneAppProps {
    page: Pages;
    setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>;
    icon: React.ReactElement;
    load: (timeToLoad: number) => void;
};

const PhoneApp = ({load, page, setCurrentPage, icon}: PhoneAppProps) => {

    const pageToAppName = useCallback((page: Pages) => {
        switch(page) {
            case Pages.Instagram:
                return 'insta';
            case Pages.Spotify:
                return 'music';
            case Pages.Canvas:
                return 'draw';
            case Pages.SchoolInstructions:
                return 'quiz';
            case Pages.School:
                return 'quiz';
            case Pages.News:
                return 'news';
            case Pages.GalleryTour:
                return 'tour';
            default:
                return 'app';
        }
    }, []);

    return (
        <Button
            className={'phone-app-button d-flex flex-column justify-content-center align-items-center'}
            onClick={(e) => {
                const timeToLoad = Math.random() * 3000;
                load(timeToLoad);
                setTimeout(() => setCurrentPage(page), timeToLoad - 2500);
            }}
        >
            <h3>{icon}</h3>
            <h6 className={'p-0 m-0'}>{pageToAppName(page)}</h6>
        </Button>
    );
};


export default PhoneApp;
