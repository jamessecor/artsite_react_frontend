import * as React from "react";
import { useRef, useState } from "react";
import { Container, Button, Row, Col, Toast } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import emailjs from '@emailjs/browser';
import { useNavigate } from "react-router-dom";
import { BackgroundColorContext, textColor } from "./BackgroundColorProvider";

const ContactForm = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigateTo = useNavigate();

    const handleChange = (e) => {
        if (e.target.id === "firstname") setFirstname(e.target.value);
        if (e.target.id === "lastname") setLastname(e.target.value);
        if (e.target.id === "email") setEmail(e.target.value);
        if (e.target.id === "message") setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        emailjs.sendForm(process.env.REACT_APP_SERVICE_ID ?? '', process.env.REACT_APP_TEMPLATE_ID ?? '', formRef.current ?? '', process.env.REACT_APP_PUBLIC_KEY ?? '')
            .then((result) => {
                // console.log(result.text);
            }, (error) => {
                // console.log(error.text);
            });
    }

    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                <Container className={`align-items-center ${textColor(color.r, color.g, color.b)}`}>
                    <Row xs={1}>
                        <Col>
                            {
                                isSubmitted
                                    ? (
                                        <Toast

                                            className={'position-absolute top-50 start-50 translate-middle'}
                                            onClose={() => navigateTo('/artworks?year=2022')}
                                            bg='success'
                                        >
                                            <Toast.Header>
                                                <strong className="me-auto">{'Success!'}</strong>
                                            </Toast.Header>
                                            <Toast.Body>
                                                {'You\'re message has been sent directly to, and only to, James.'}
                                                <br /><br />
                                                {'Thanks for reaching out!'}
                                            </Toast.Body>
                                        </Toast>
                                    )
                                    : (
                                        <Form ref={formRef} noValidate validated={isSubmitted} className={'bg-dark rounded p-5 col-lg-6 offset-lg-3'} onSubmit={handleSubmit}>
                                            <h5 className="pb-4 d-flex justify-content-center">join email list / leave a message</h5>
                                            <Form.Group className="mb-3" controlId="firstname">
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control name='firstname' type="text" value={firstname} onChange={handleChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="lastname">
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control name='lastname' type="text" value={lastname} onChange={handleChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control required name='email' type="email" value={email} onChange={handleChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="message">
                                                <Form.Label>Message</Form.Label>
                                                <Form.Control rows={3} as="textarea" name='message' value={message} onChange={handleChange} />
                                            </Form.Group>
                                            <Button className={'w-100'} type='submit' variant={'success'} disabled={isSubmitted}>Submit</Button>
                                        </Form>
                                    )
                            }
                        </Col>
                    </Row>
                </Container>
            )}
        </BackgroundColorContext.Consumer>

    );
}

export default ContactForm;