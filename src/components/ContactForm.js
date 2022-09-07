import React, { useRef, useState } from "react";
import config from '../config.json';
import SubmitButton from "./SubmitButton";
import Form from 'react-bootstrap/Form';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const formRef = useRef();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        if (e.target.id === "firstname") setFirstname(e.target.value);
        if (e.target.id === "lastname") setLastname(e.target.value);
        if (e.target.id === "email") setEmail(e.target.value);
        if (e.target.id === "message") setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        emailjs.sendForm(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID, formRef.current, process.env.REACT_APP_PUBLIC_KEY)
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        let submitButton = e.target;
        submitButton.disabled = true;
    }

    return (
        <Form ref={formRef} noValidate validated={isSubmitted} className={'col-lg-6 offset-lg-3'} onSubmit={handleSubmit}>
            <h5 className="pb-4 d-flex justify-content-center">join email list / leave a message</h5>
            <Form.Group className="mb-3" controlId="firstname">
                <Form.Label>First Name</Form.Label>
                <Form.Control name='firstname' type="text" value={firstname} onChange={handleChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control name='lastname' type="text" value={lastname} onChange={handleChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control required name='email' type="email" value={email} onChange={handleChange}/>
                {/* <Form.Control.Feedback type={this.state.errors.includes("email") ? "invalid" : "valid"}>A valid email address is required</Form.Control.Feedback> */}
            </Form.Group>
            <Form.Group className="mb-3" controlId="message">
                <Form.Label>Message</Form.Label>
                <Form.Control rows={3} as="textarea" name='message' value={message} onChange={handleChange}/>
            </Form.Group>
            <SubmitButton />
        </Form>
    );
/*
    return {
        isSubmitted // && errors.length === 0
        ? (
            <div>
                <div className="mt-2 d-flex justify-content-center">
                    <h4>Success!</h4>
                </div>
                <div className="mt-2 d-flex justify-content-center">
                    <div>Thanks for your message.</div>
                </div>
            </div>
        ) : ( Form goes here )
    }
    */
             
}

export default ContactForm;