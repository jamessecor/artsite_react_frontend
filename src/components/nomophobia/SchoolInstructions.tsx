import * as React from 'react';
import { useState } from 'react';
import { Toast, Button } from 'react-bootstrap';
import { Pages } from './Nomophobia';

const INSTRUCTIONS_1 = 'During the pandemic many, if not all, Americans were forced to do their learning remotely. Due to varying levels of internet access, some could not finish their work on time.';
const INSTRUCTIONS_2 = 'Can you finish this worksheet before the it\'s due? Watch out for buffering!';

const SchoolInstructions = ({ isLoading, setCurrentPage }) => {
    const [isLoadingHomework, setIsLoadingHomework] = useState(false);
    const onStart = () => {
        setCurrentPage(Pages.School);
    };

    return (
        <Toast>
            <Toast.Header>
                {'Homework game'}
            </Toast.Header>
            <Toast.Body>
                {INSTRUCTIONS_1}
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
