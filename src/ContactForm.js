import React from "react";
import config from './config.json'
import SubmitButton from "./SubmitButton";

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
        let firstname = e.target.name === "firstname" ? e.target.value : this.state.inputs.firstname
        let lastname = e.target.name === "lastname" ? e.target.value : this.state.inputs.lastname
        let email = e.target.name === "email" ? e.target.value : this.state.inputs.email
        let message = e.target.name === "message" ? e.target.value : this.state.inputs.message
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

        const requestMetadata = {
            method: 'POST',
            body: JSON.stringify(this.state.inputs),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
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
                <div className="d-flex justify-content-center">thanks for your message!</div>
            )
        } else {
            return (
                <form className={this.state.isSubmitted ? 'was-validated col-lg-6 offset-lg-3': 'needs-validation col-lg-6 offset-lg-3'} onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="firstname">First Name</label>
                        <input className="form-control" type="text" name="firstname" value={this.state.inputs.firstname}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="lastname">Last Name</label>
                        <input className="form-control" type="text" name="lastname" value={this.state.inputs.lastname}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" type="email" name="email" value={this.state.inputs.email}
                               onChange={this.handleChange} required />
                        <div className={this.state.errors.indexOf("email") >= 0 ? "invalid-feedback" : "valid-feedback"}>A valid email address is required</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="message">Message</label>
                        <textarea className="form-control" rows="3" name="message" value={this.state.inputs.message}
                                  onChange={this.handleChange} />
                    </div>
                    <SubmitButton/>
                </form>
            )
        }
    }
}

export default ContactForm;