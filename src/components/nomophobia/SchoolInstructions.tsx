import * as React from 'react';
import { useState } from 'react';
import { Toast, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Pages } from './Nomophobia';

interface SchoolInstructionsParams {
    isLoading?: boolean;
}

const INSTRUCTIONS_1 = 'During the pandemic many, if not all, Americans in school were forced to do their learning remotely. Due to disparities in internet access, some were unable to keep up with their work.';
const INSTRUCTIONS_2 = 'You have 15 seconds to finish this worksheet before the it\'s due. Watch out for buffering!';

const SchoolInstructions: React.FC<SchoolInstructionsParams> = ({ isLoading }) => {
    const navigateTo = useNavigate();

    const onStart = () => {
        navigateTo('/nomophobia/school');
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
