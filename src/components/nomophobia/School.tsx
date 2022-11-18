import * as React from "react";
import { useCallback, useMemo, useState } from 'react';
import { InputGroup, Form, Button } from "react-bootstrap";
import { BsFillBookmarkCheckFill, BsXCircleFill } from 'react-icons/bs';

interface IFormAnswers {
    0: number | null;
    1: number | null;
    2: number | null;
    3: number | null;
    4: number | null;
};

interface ICheckedAnswers {
    0: boolean | null;
    1: boolean | null;
    2: boolean | null;
    3: boolean | null;
    4: boolean | null;
};

const getRandomZeroToNine = () => Math.round(Math.random() * 10) - 1;

const School = () => {
    const [completed, setCompleted] = useState(false);

    const [checkedAnswers, setCheckedAnswers] = useState<ICheckedAnswers>({
        0: null,
        1: null,
        2: null,
        3: null,
        4: null
    });

    const [formAnswers, setFormAnswers] = useState<IFormAnswers>({
        0: null,
        1: null,
        2: null,
        3: null,
        4: null
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

    React.useEffect(() => {
        console.log('c', checkedAnswers);
    }, [checkedAnswers]);

    const submitForm = useCallback((e) => {
        e.preventDefault();
        setCompleted(true);
    }, [formAnswers]);

    return (
        <div className={'overflow-auto phone-screen-off bg-light'}>
            <Form onSubmit={(e) => submitForm(e)} className={'p-2 justify-content-center'}>
                <Form.Label>Math Homework</Form.Label>
                {problemsAndAnswers.answers.map((answer, index) => {
                    return (
                        <InputGroup
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
                            <InputGroup.Text id="basic-addon3">
                                {`${problemsAndAnswers.x[index]} x ${problemsAndAnswers.y[index]} = `}
                            </InputGroup.Text>
                            <Form.Control id={`question-${index}`} aria-describedby="basic-addon3" />
                            { completed && (
                                <div className={'position-absolute end-0 me-1'}>
                                    {checkedAnswers[index] ? <BsFillBookmarkCheckFill color={'green'} /> : <BsXCircleFill color={'orangered'} />}
                                </div>
                            )}
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
            </Form>
        </div>
    );
};

export default School;