import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { InputGroup, Spinner, Form, Button, Badge, Placeholder } from "react-bootstrap";
import { BsFillBookmarkCheckFill, BsXCircleFill } from 'react-icons/bs';

interface IFormAnswers {
    0: number | null;
    1: number | null;
    2: number | null;
    3: number | null;
    4: number | null;
    5: number | null;
    6: number | null;
};

interface ICheckedAnswers {
    0: boolean | null;
    1: boolean | null;
    2: boolean | null;
    3: boolean | null;
    4: boolean | null;
    5: boolean | null;
    6: boolean | null;
};

type IBuffer = number | null;

const TIME_TO_COMPLETE = 15000;

const getRandomZeroToNine = () => Math.round(Math.random() * 10) - 1;

const School = ({isLoading}) => {
    const [completed, setCompleted] = useState(false);
    const [timesUp, setTimesUp] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(TIME_TO_COMPLETE);
    const [isBuffering, setIsBuffering] = useState<IBuffer>(null);

    const [checkedAnswers, setCheckedAnswers] = useState<ICheckedAnswers>({
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null
    });

    const [formAnswers, setFormAnswers] = useState<IFormAnswers>({
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null
    });

    const getProblemsAndAnswers = useCallback(() => {
        const x = [getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine()];
        const y = [getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine()];
        const answers = x.map((a, index) => a * y[index]);
        return {
            x: x,
            y: y,
            answers: answers
        };
    }, []);

    const problemsAndAnswers = useMemo(() => getProblemsAndAnswers(), [getProblemsAndAnswers]);

    const allCorrect = useMemo(() => Object.values(checkedAnswers).every(Boolean), [checkedAnswers]);

    useEffect(() => {
        if (isBuffering) {
            setTimeout(() => {
                setIsBuffering(null);
            }, isBuffering);
        }
    }, [isBuffering])

    useEffect(() => {
        const timeRemainingTimer = setInterval(() => {
            setTimeRemaining(timeRemaining - 1000);
            const shouldBuffer = Math.random() * 5 > 4;
            if (shouldBuffer && !timesUp) {
                setIsBuffering((Math.random() * 500) + 1000);
            }
        }, 1000);
        return function cleanup() {
            clearInterval(timeRemainingTimer);
        };
    }, [timeRemaining]);

    useEffect(() => {
        if (timeRemaining <= 0) {
            setTimesUp(true);
        }
    }, [timeRemaining]);

    const submitForm = useCallback((e) => {
        e.preventDefault();
        setCompleted(true);
    }, []);

    return (
        <div className={'overflow-auto phone-screen-off bg-success'}>
            {!isLoading && (isBuffering && isBuffering > 0) && (
                <div style={{zIndex: 10000}} className={'d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle'}>
                    <Spinner variant={'info'} animation={'border'} />
                    <Badge pill={true} className={'bg-info'}>
                        {'Buffering...'}
                    </Badge>
                </div>
            )}
            <Form onSubmit={(e) => submitForm(e)} className={'p-2 justify-content-center'}>
                <Form.Label className={'mb-0 w-100 text-center fw-bold text-light text-decoration-underline'}>Math Homework</Form.Label>
                {(completed && allCorrect) || timesUp ? (
                    <>
                        <Badge className={'position-absolute me-2 end-0'} pill={true} bg={timesUp && !allCorrect ? 'danger' : 'success'}>{timesUp && !allCorrect ? 'LATE! No Credit.' : 'Done!'}</Badge>
                        <iframe style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/5lFTD6w4CxgyOxYsBaZ2nD?utm_source=generator" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    </>
                ) : (
                    <>
                        <Badge style={{zIndex: 100}} className={'position-absolute me-2 end-0'} pill={true} bg={timesUp ? 'danger' : 'warning'}>{timesUp ? ':(' : `:${timeRemaining / 1000}`}</Badge>
                        {problemsAndAnswers.answers.map((answer, index) => {
                            return (
                                <InputGroup
                                    key={index}
                                    onChange={(e) => {
                                        const inputValue = (e.target as HTMLInputElement).value;
                                        setFormAnswers({...formAnswers, [index]: inputValue});
                                        setCheckedAnswers({
                                            ...checkedAnswers,
                                            [index]: (Number(answer) === Number(inputValue))
                                        });
                                    }}
                                    className={'my-2'}
                                >
                                    <Button disabled={true} className={'p-0'} variant={'light'}>{`${index + 1}.`}</Button>
                                        {isLoading || isBuffering ? (
                                            <Placeholder as={InputGroup.Text} className={'w-50'} animation="glow">
                                                <Placeholder className={'w-100'} />
                                            </Placeholder>
                                        ) : (
                                            <InputGroup.Text id="basic-addon3">
                                                {`${problemsAndAnswers.x[index]} x ${problemsAndAnswers.y[index]} = `}
                                            </InputGroup.Text>
                                        )}
                                    <Form.Control autoComplete={'off'} type={'number'} id={`question-${index}`} aria-describedby="basic-addon3" />
                                    <div className={'position-absolute end-0 me-1'}>
                                        {checkedAnswers[index] 
                                            ? <BsFillBookmarkCheckFill color={'green'} /> 
                                            : (checkedAnswers[index] === false ? <BsXCircleFill color={'orangered'} /> : null)}
                                    </div>                                
                                </InputGroup>
                            )
                        })}
                        <Button
                            disabled={timesUp || completed || Boolean(isBuffering)}
                            className={`w-100 ${completed ? 'btn-success' : (timesUp ? 'btn-danger' : '')}`}
                            type={'submit'}
                        >
                            {completed ? 'Complete!' : (timesUp ? 'Time\'s Up :(' : 'Submit Worksheet')}
                        </Button>
                    </>
                )}
            </Form>
        </div>
    );
};

export default School;