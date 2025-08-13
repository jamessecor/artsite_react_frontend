import * as React from 'react';
import { useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import './PhoneApp.css';
import { Pages } from './Nomophobia';
import { useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons';

interface PhoneAppProps {
    page: Pages;
    routePath: string;
    icon: IconType;
};

const getAppName = (page: Pages): string => {
    switch (page) {
        case Pages.Instagram:
            return 'Instagram';
        case Pages.Video:
            return 'Video';
        case Pages.Spotify:
            return 'Music';
        case Pages.Canvas:
            return 'Draw';
        case Pages.SchoolInstructions:
        case Pages.School:
            return 'Quiz';
        case Pages.News:
            return 'News';
        case Pages.GalleryTour:
            return 'Gallery';
        case Pages.Likes:
            return 'Likes';
        case Pages.Colors:
            return 'Colors';
        default:
            return 'App';
    }
};

const PhoneApp = ({ page, routePath, icon }: PhoneAppProps) => {
    const navigateTo = useNavigate();
    const appName = getAppName(page);
    const [isLoading, setIsLoading] = React.useState(false);

    return (
        <Button
            className={'phone-app-button'}
            data-app-name={appName}
            onClick={(e) => {
                const timeToLoad = Math.random() * 2500;
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    navigateTo(`/nomophobia/${routePath}`);
                }, timeToLoad);
            }}
        >
            {isLoading ? (
                <Spinner animation="border" role="status" />
            ) : (
                icon({ })
            )}
        </Button>
    );
};

export default PhoneApp;
