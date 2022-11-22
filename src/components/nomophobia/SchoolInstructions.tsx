import * as React from 'react';
import { useState } from 'react';
import { Toast, Button } from 'react-bootstrap';
import { Pages } from './Nomophobia';

const INSTRUCTIONS_1 = 'During the pandemic many, if not all, Americans in school were forced to do their learning remotely. Due to disparities in internet access, some were unable to keep up with their work.';
const INSTRUCTIONS_2 = 'Can you finish this worksheet before the it\'s due? Watch out for buffering!';

const SchoolInstructions = ({ isLoading, setCurrentPage }) => {
    const [isLoadingHomework, setIsLoadingHomework] = useState(false);
    const onStart = () => {
        setCurrentPage(Pages.School);
    };

    return (
        <Toast>
            <Toast.Header className={'justify-content-between'}>
                {'Homework game'}
            </Toast.Header>
            <Toast.Body>
                {INSTRUCTIONS_1}
                <br />
                <br />
                {INSTRUCTIONS_2}
                {isLoadingHomework ? (
                    <Button disabled={true}>{'Loading...'}</Button>
                )
                : (
                    <Button onClick={() => onStart()}>{'Start My Homework'}</Button>
                )}
            </Toast.Body>
        </Toast>
    )
};

export default SchoolInstructions;
