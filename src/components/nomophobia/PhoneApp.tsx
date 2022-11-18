import * as React from 'react';
import { Button } from 'react-bootstrap';
import './PhoneApp.css';
import { Pages } from './Nomophobia';

interface PhoneAppProps {
    page: Pages;
    setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>;
    icon: React.ReactElement;
    load: (timeToLoad: number) => void;
};

const PhoneApp = ({load, page, setCurrentPage, icon}: PhoneAppProps) => (
    <Button
        className={'d-flex justify-content-center btn btn-dark btn-rounded btn-icon phone-app-button'}
        onClick={(e) => {
            const timeToLoad = Math.random() * 3000;
            load(timeToLoad);
            setTimeout(() => setCurrentPage(page), timeToLoad - 2500);
        }}
    >
        <h3 className={'align-self-center'}>{icon}</h3>
    </Button>
);

export default PhoneApp;
