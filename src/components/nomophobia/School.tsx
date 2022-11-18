import * as React from "react";
import { useCallback, useMemo, useState } from 'react';
import { InputGroup, Form, Button, Badge, Placeholder } from "react-bootstrap";
import { BsFillBookmarkCheckFill, BsXCircleFill } from 'react-icons/bs';

interface IFormAnswers {
    0: number | null;
    1: number | null;
    2: number | null;
    3: number | null;
    4: number | null;
    5: number | null;
};

interface ICheckedAnswers {
    0: boolean | null;
    1: boolean | null;
    2: boolean | null;
    3: boolean | null;
    4: boolean | null;
    5: boolean | null;
};

const getRandomZeroToNine = () => Math.round(Math.random() * 10) - 1;

const School = ({isLoading}) => {
    const [completed, setCompleted] = useState(false);

    const [checkedAnswers, setCheckedAnswers] = useState<ICheckedAnswers>({
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null
    });

    const [formAnswers, setFormAnswers] = useState<IFormAnswers>({
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null
    });

    const getProblemsAndAnswers = useCallback(() => {
        const x = [getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine()];
        const y = [getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine(), getRandomZeroToNine()];
        const answers = x.map((a, index) => a * y[index]);
        return {
            x: x,
            y: y,
            answers: answers
        };
    }, []);

    const problemsAndAnswers = useMemo(() => getProblemsAndAnswers(), [getProblemsAndAnswers]);

    const allCorrect = useMemo(() => Object.values(checkedAnswers).every(Boolean), [checkedAnswers]);

    const submitForm = useCallback((e) => {
        e.preventDefault();
        setCompleted(true);
    }, []);

    return (
        <div className={'overflow-auto phone-screen-off bg-light'}>
            <Form onSubmit={(e) => submitForm(e)} className={'p-2 justify-content-center'}>
                <Form.Label>Math Homework</Form.Label>
                {completed && allCorrect ? (
                    <>
                        <Badge className={'position-absolute me-2 end-0'} pill={true} bg={'success'}>{'Done!'}</Badge>
                        <iframe style={{borderRadius:'12px'}} src="https://open.spotify.com/embed/episode/5lFTD6w4CxgyOxYsBaZ2nD?utm_source=generator" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    </>
                ) : (
                    <>
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
                                        {isLoading ? (
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
                            disabled={completed}
                            className={`w-100 ${completed ? 'btn-success' : ''}`}
                            type={'submit'}
                        >
                            {completed ? 'Complete!' : 'Submit Worksheet'}
                        </Button>
                    </>
                )}
            </Form>
        </div>
    );
};

export default School;