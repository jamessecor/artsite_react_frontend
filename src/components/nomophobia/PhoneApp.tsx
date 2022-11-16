import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import './PhoneApp.css';
import { Pages } from './Nomophobia';

interface PhoneAppProps {
    page: Pages;
    setCurrentPage: unknown;
    icon: IconDefinition;
};

const PhoneApp = ({page, setCurrentPage, icon}) => (
    <Button onClick={(e) => setCurrentPage(page)} className={'btn btn-dark btn-rounded btn-icon phone-app-button'}>
        <FontAwesomeIcon icon={icon} />
    </Button>
);

export default PhoneApp;
