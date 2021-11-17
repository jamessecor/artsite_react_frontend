import React from 'react'
import './LoginForm.css'
import SubmitButton from './SubmitButton'
import config from "./config.json";
import Form from 'react-bootstrap/Form';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            inputs: {
                user: {
                    email: "",
                    password: ""
                }
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let submitButton = e.target;
        submitButton.disabled = true;

        let formData = new FormData();
        for (const property in this.state.inputs.user) {
            if (this.state.inputs.user[property] !== undefined) {
                formData.append(`user[${property}]`, this.state.inputs.user[property]);
            }
        }
        const requestMetadata = {
            method: 'POST',
            body: formData
        };

        fetch(`${config.host}users/sign_in`, requestMetadata)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "ok") {
                        this.props.unmount(result);
                    } else if (result.status === "unauthorized") {
                        this.setState({
                            errors: [result["errors"]],
                        })
                    }
                    // Re-enable the submit button
                    submitButton.disabled = false;
                }
            )
    }

    handleChange(e) {
        let email = e.target.id === "email" ? e.target.value : this.state.inputs.user.email
        let password = e.target.id === "password" ? e.target.value : this.state.inputs.user.password
        this.setState({
            inputs: {
                user: {
                    email: email,
                    password: password
                }
            }
        })
    }

    render() {
        return (
            <div className="position-relative">
                <Form className="needs-validation loginForm position-fixed top-50 start-50 translate-middle" onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>email</Form.Label>
                        <Form.Control onChange={this.handleChange} type="email"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>password</Form.Label>
                        <Form.Control onChange={this.handleChange} type="password"/>
                    </Form.Group>
                    <SubmitButton />
                    <div className="text-warning ps-3">{this.state.errors}</div>
                </Form>
            </div>
        )
    }
}

export default LoginForm;