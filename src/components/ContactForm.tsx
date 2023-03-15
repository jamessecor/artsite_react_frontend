import * as React from "react";
import { useRef, useState } from "react";
import { Container, Button, Row, Col, Toast, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { BackgroundColorContext, textColor } from "./providers/BackgroundColorProvider";

const ContactForm = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const navigateTo = useNavigate();

    const handleChange = (e) => {
        if (e.target.id === "firstname") setFirstname(e.target.value);
        if (e.target.id === "lastname") setLastname(e.target.value);
        if (e.target.id === "email") setEmail(e.target.value);
        if (e.target.id === "message") setMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const emailResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: email,
                message: message
            })
        });
        if (emailResponse) {
            setIsSuccessful(true);
        }
    }

    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                <Container className={`align-items-center ${textColor(color.r, color.g, color.b)}`}>
                    <Row xs={1}>
                        <Col>
                            {
                                isSuccessful
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
                                                {'Thanks for reaching out!'}
                                                <br /><br />
                                                {'You\'re message has been sent to James.'}
                                            </Toast.Body>
                                        </Toast>
                                    )
                                    : (
                                        <Form ref={formRef} noValidate validated={isSubmitted} className={'bg-dark rounded p-5 col-lg-6 offset-lg-3'} onSubmit={handleSubmit}>
                                            <h5 className="pb-4 d-flex justify-content-center">join email list / leave a message</h5>
                                            <Form.Group className="mb-3" controlId="firstname">
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control disabled={isSubmitted} name='firstname' type="text" value={firstname} onChange={handleChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="lastname">
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control disabled={isSubmitted} name='lastname' type="text" value={lastname} onChange={handleChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control disabled={isSubmitted} required name='email' type="email" value={email} onChange={handleChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="message">
                                                <Form.Label>Message</Form.Label>
                                                <Form.Control disabled={isSubmitted} rows={3} as="textarea" name='message' value={message} onChange={handleChange} />
                                            </Form.Group>
                                            <Button className={'w-100'} type='submit' variant={'success'} disabled={isSubmitted}>
                                                {isSubmitted
                                                    ? <Spinner variant={'info'} animation={'border'} />
                                                    : <span>Submit</span>
                                                }
                                            </Button>
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