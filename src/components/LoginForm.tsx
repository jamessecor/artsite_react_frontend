import * as React from "react";
import { useState } from "react";
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { BackgroundColorContext, textColor } from "./providers/BackgroundColorProvider";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { AuthenticationContext } from "./providers/AuthenticationProvider";

interface ILoginFormData {
    username: string;
    password: string;
}

interface ILoginFormResponse {
    data: {
        token: string;
    }
}

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigateTo = useNavigate();

    const { mutate } = useMutation<ILoginFormResponse, AxiosError, ILoginFormData>(formData => {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users`, formData);
    }, {
        onSuccess: (data, variables, context) => {
            sessionStorage.setItem('artsite-token', data.data.token);
            navigateTo(-1);
        },
        onError: (data) => setError(data.message)
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutate({
            username: username,
            password: password
        });
    }

    return (
        <AuthenticationContext.Consumer>
            {({ isLoggedIn, setIsLoggedIn }) => (
                <BackgroundColorContext.Consumer>
                    {({ color, setColor }) => (
                        <Container className={`align-items-center ${textColor(color.r, color.g, color.b)}`}>
                            <Row xs={1}>
                                <Col>
                                    <Form className="bg-dark rounded p-5 col-lg-6 offset-lg-3" onSubmit={handleSubmit}>
                                        <h2>{'Login'}</h2>
                                        <Form.Group className="mb-3" controlId="username">
                                            <Form.Label>username</Form.Label>
                                            <Form.Control onChange={(e) => setUsername(e.target.value)} type="username" />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label>password</Form.Label>
                                            <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" />
                                            <Form.Label>
                                                {error}
                                            </Form.Label>
                                        </Form.Group>
                                        <Button type={'submit'}>
                                            {'Login'}
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    )}
                </BackgroundColorContext.Consumer>
            )}
        </AuthenticationContext.Consumer>
    )
}

export default LoginForm;
