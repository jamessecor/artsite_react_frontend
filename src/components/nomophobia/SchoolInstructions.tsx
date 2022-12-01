import * as React from 'react';
import { useState } from 'react';
import { Toast, Button } from 'react-bootstrap';
import { Pages } from './Nomophobia';

const INSTRUCTIONS_1 = 'During the pandemic many, if not all, Americans in school were forced to do their learning remotely. Due to disparities in internet access, some were unable to keep up with their work.';
const INSTRUCTIONS_2 = 'Can you finish this worksheet before the it\'s due? Watch out for buffering!';

const SchoolInstructions = ({ isLoading, setCurrentPage }) => {
    const onStart = () => {
        setCurrentPage(Pages.School);
    };

    return (
        <Toast bg={'success'} className={'h-100'}>
            <Toast.Header 
                className={'justify-content-center'}
                closeButton={false}
            >
                {'Homework game'}
            </Toast.Header>
            <Toast.Body>
                <div className={'d-flex flex-column text-center'}>
                    <div className={'pb-2'}>{INSTRUCTIONS_1}</div>
                    <div className={'pb-2'}>{INSTRUCTIONS_2}</div>
                    {isLoading ? (
                        <Button disabled={true}>{'Loading...'}</Button>
                    )
                    : (
                        <Button onClick={() => onStart()}>{'Start My Homework'}</Button>
                    )}
                </div>
            </Toast.Body>
        </Toast>
    )
};

export default SchoolInstructions;
