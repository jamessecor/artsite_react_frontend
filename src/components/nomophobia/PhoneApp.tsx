import * as React from 'react';
import { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import './PhoneApp.css';
import { Pages } from './Nomophobia';
import { useNavigate } from 'react-router-dom';

interface PhoneAppProps {
    page: Pages;
    routePath: string;
    icon: React.ReactElement;
    load: (timeToLoad: number) => void;
};

const PhoneApp = ({ load, page, routePath, icon }: PhoneAppProps) => {
    const navigateTo = useNavigate();
    const pageToAppName = useCallback((page: Pages) => {
        switch (page) {
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
            case Pages.Likes:
                return 'likes';
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
                setTimeout(() => navigateTo(`/nomophobia/${routePath}`), timeToLoad - 2500);
            }}
        >
            <h3>{icon}</h3>
            <h6 className={'p-0 m-0'}>{pageToAppName(page)}</h6>
        </Button>
    );
};


export default PhoneApp;
