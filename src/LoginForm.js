import React from 'react'
import './LoginForm.css'
import SubmitButton from './SubmitButton'
import config from "./config.json";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        // formData.append("user", this.state.inputs.user);
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
                    if (result["status"] === "ok") {
                        this.props.unmount(result);
                    } else if (result["status"] === "failure") {
                        this.setState({
                            errors: result["errors"],
                        })
                    }
                    // Re-enable the submit button
                    submitButton.disabled = false;
                }
            )
    }

    handleChange(e) {
        let email = e.target.name === "email" ? e.target.value : this.state.inputs.user.email
        let password = e.target.name === "password" ? e.target.value : this.state.inputs.user.password
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
                <form className="loginForm position-fixed top-50 start-50 translate-middle" onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">email</label>
                        <input onChange={this.handleChange} className="form-control" type="text" name="email"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input onChange={this.handleChange} className="form-control" type="password" name="password"/>
                    </div>
                    <SubmitButton />
                </form>
            </div>
        )
    }
}

export default LoginForm;