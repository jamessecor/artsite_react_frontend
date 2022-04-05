import React from 'react'
import './LoginForm.css'
import SubmitButton from './SubmitButton'
import config from "./config.json";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            show: props.show,
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.show !== this.props.show) {
            this.setState({show: this.props.show});
        }
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

        fetch(`${config.host}api/users/sign_in`, requestMetadata)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "ok") {
                        this.setState({errors: []});
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
            <div>
                <Modal show={this.state.show} onHide={() => this.setState({show: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="needs-validation" onSubmit={this.handleSubmit}>
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
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default LoginForm;