import React from "react";
import config from '../config.json';
import SubmitButton from "./SubmitButton";
import Form from 'react-bootstrap/Form';

class ContactForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitted: false,
            errors: [],
            inputs: {
                firstname: props.inputs === null ? "" : props.inputs.firstname,
                lastname: props.inputs === null ? "" : props.inputs.lastname,
                email: props.inputs === null ? "" : props.inputs.email,
                message: props.inputs === null ? "" : props.inputs.message
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let firstname = e.target.id === "firstname" ? e.target.value : this.state.inputs.firstname
        let lastname = e.target.id === "lastname" ? e.target.value : this.state.inputs.lastname
        let email = e.target.id === "email" ? e.target.value : this.state.inputs.email
        let message = e.target.id === "message" ? e.target.value : this.state.inputs.message
        this.setState({
            inputs: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                message: message
            }
        })
    }

    componentWillUnmount() {
        this.props.formWillUnmount(this.state.inputs);
    }

    handleSubmit(e) {
        e.preventDefault();
        let submitButton = e.target;
        submitButton.disabled = true;

        let formData = new FormData();
        for (const property in this.state.inputs) {
            if (this.state.inputs[property] !== undefined) {
                formData.append(property, this.state.inputs[property]);
            }
        }
        const requestMetadata = {
            method: 'POST',
            body: formData
        };

        fetch(`${config.host}api/new_contact`, requestMetadata)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result["status"] === "ok") {
                        this.setState({
                            errors: [],
                            inputs: {
                                firstname: "",
                                lastname: "",
                                message: "",
                                email: ""
                            }
                        })
                    } else if (result["status"] === "failure") {
                        this.setState({
                            errors: result["errors"],
                        })
                    }
                    this.setState({
                        isSubmitted: true
                    })
                    // Re-enable the submit button
                    submitButton.disabled = false;
                }
            )
    }

    render() {
        if (this.state.isSubmitted && this.state.errors.length === 0) {
            return (
                <div>
                    <div className="mt-2 d-flex justify-content-center">
                        <h4>Success!</h4>
                    </div>
                    <div className="mt-2 d-flex justify-content-center">
                        <div>Thanks for your message.</div>
                    </div>
                </div>
            )
        } else {
            return (
                <Form noValidate validated={this.state.isSubmitted} className={'col-lg-6 offset-lg-3'} onSubmit={this.handleSubmit}>
                    <h5 className="pb-4 d-flex justify-content-center">join email list / leave a message</h5>
                    <Form.Group className="mb-3" controlId="firstname">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={this.state.inputs.firstname} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lastname">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={this.state.inputs.lastname} onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control required type="email" value={this.state.inputs.email} onChange={this.handleChange}/>
                        <Form.Control.Feedback type={this.state.errors.includes("email") ? "invalid" : "valid"}>A valid email address is required</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="message">
                        <Form.Label>Message</Form.Label>
                        <Form.Control rows={3} as="textarea" value={this.state.inputs.message} onChange={this.handleChange}/>
                    </Form.Group>
                    <SubmitButton />
                </Form>
            )
        }
    }
}

export default ContactForm;