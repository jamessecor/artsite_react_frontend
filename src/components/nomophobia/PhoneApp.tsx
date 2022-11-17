import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import './PhoneApp.css';
import { Pages } from './Nomophobia';
import { loadavg } from 'os';

interface PhoneAppProps {
    page: Pages;
    setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>;
    icon: IconDefinition;
    load: (timeToLoad: number) => void;
};

const PhoneApp = ({load, page, setCurrentPage, icon}: PhoneAppProps) => (
    <Button
        onClick={(e) => {
            const timeToLoad = Math.random() * 5000;
            load(timeToLoad);
            setTimeout(() => setCurrentPage(page), timeToLoad - 1000);
        }}
        className={'btn btn-dark btn-rounded btn-icon phone-app-button'}
    >
        <FontAwesomeIcon icon={icon} />
    </Button>
);

export default PhoneApp;
