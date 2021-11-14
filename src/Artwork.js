import React from "react"
import FadeOut from "./FadeOut"
import ArtworkForm from "./ArtworkForm"
import MovingColorImg from "./MovingColorImg";
import PriceFormatter from "./PriceFormatter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import config from './config.json'

class Artwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPreview: false,
            imageAdded: false,
            isShowingAlert: false,
            isRotating: props.isRotating,
            isShowingInfo: false,
            submitButtonId: props.isNew ? "submitButtonNew" : "submitButton-" + props.attributes.id,
            flashMessage: "",
            submitButtonValue: props.isNew ? "Create" : "Update",
            isNew: props.isNew,
            isEditable: props.isEditable,
            id: props.isNew ? "" : props.attributes.id,
            title: props.attributes.title,
            medium: props.attributes.medium,
            year: props.attributes.year,
            price: props.attributes.price,
            image: props.attributes.image,
            saleDate: props.attributes.sale_date
        };

        this.togglePreview = this.togglePreview.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleShowInfo = this.toggleShowInfo.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isEditable !== prevProps.isEditable) {
            this.setState({isEditable: this.props.isEditable});
        }
    }

    togglePreview() {
        this.setState(prevState => ({
            isPreview: !prevState.isPreview
        }));
    }

    toggleShowInfo(e) {
        e.preventDefault();
        this.setState(prevState => ({
            isShowingInfo: !prevState.isShowingInfo
        }));
    }

    handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        for (const property in this.state) {
            if (property === "image" && !this.state.imageAdded) {
                // Do nothing if no image was added.
            } else {
                if (this.state[property] !== undefined) {
                    formData.append(property, this.state[property]);
                }
            }
        }
        const postUrl = this.state.isNew ? `${config.host}api/artworks` : `${config.host}api/artworks/` + this.state.id;
        const method = this.state.isNew ? 'POST' : 'PUT';
        const requestMetadata = {
            body: formData,
            method: method,

        };
        fetch(postUrl, requestMetadata)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    if (result["status"] === "ok") {
                        this.setState({
                            isNew: false,
                            submitButtonValue: "Update",
                            insertNewForm: result["insertNewForm"]
                        })
                    } else if (result["status"] === "failure") {
                    }
                    this.setState({
                        flashMessage: result["message"],
                        isShowingAlert: true
                    })
                    // Set the image
                    try {
                        const artwork = JSON.parse(result["artwork"])
                        if (artwork["image"] !== undefined) {
                            this.setState({
                                image: artwork["image"]
                            });
                        }
                        this.setState({
                            submitButtonId: "submitButton-" + artwork["id"],
                            id: artwork["id"]
                        });

                    } catch (e) {
                    }
                    // Re-enable the submit button
                    document.getElementById(this.state.submitButtonId).disabled = false;
                    console.log(this.state.submitButtonId);
                }
            )
    }

    handleChange(e) {
        const fieldName = e.target.name;
        // TODO: fix this. Causes error for image.
        const value = fieldName === "image" ? e.target.files[0] : e.target.value;
        this.setState({
            [fieldName]: value,
            imageAdded: fieldName === "image",
            isShowingAlert: false
        });
    }

    render() {
        if (this.state.isEditable && !this.state.isPreview) {
            return (
                <div>
                    {this.state.insertNewForm ? <ArtworkForm/> : ""}
                    <form className="d-flex mb-4 justify-content-center" onSubmit={this.handleSubmit}>
                        <div className="col-lg-6 col-12">
                            <MovingColorImg isRotating={this.state.isRotating} src={this.state.image}/>
                        </div>
                        <div className="align-self-end artwork-info col-lg-6 col-12">
                            <div className="d-flex flex-column ms-2">
                                <button className="btn btn-primary" type="button"
                                        onClick={this.togglePreview}>preview
                                </button>
                                <label htmlFor="title">Title</label>
                                <input type="text" name="title" defaultValue={this.state.title}
                                       onChange={this.handleChange}/>
                                <label htmlFor="year">Year</label>
                                <input type="text" name="year" defaultValue={this.state.year}
                                       onChange={this.handleChange}/>
                                <label htmlFor="price">Price</label>
                                <input type="text" name="price" defaultValue={this.state.price}
                                       onChange={this.handleChange}/>
                                <label htmlFor="medium">Medium</label>
                                <input type="text" name="medium" defaultValue={this.state.medium}
                                       onChange={this.handleChange}/>
                                <label htmlFor="image">Image</label>
                                <input type="file" name="image" defaultValue="" onChange={this.handleChange}/>
                                <button id={this.state.submitButtonId} className="btn btn-primary"
                                        data-disable="true" type="submit">{this.state.submitButtonValue}</button>
                                <FadeOut isShown={this.state.isShowingAlert} message={this.state.flashMessage}/>
                            </div>
                        </div>
                    </form>
                </div>
            );
        } else {
            return (
                <div className="row justify-content-center">
                    <div className="col-lg-11 col-11 pe-1">
                        <MovingColorImg isRotating={this.state.isRotating} src={this.state.image}/>
                        <div className={this.state.isShowingInfo ? "" : "d-none"}>
                            <div className="d-flex flex-column ms-2">
                                <button className={this.state.isEditable ? 'btn btn-primary' : 'btn btn-primary d-none'}
                                        type="button" onClick={this.togglePreview}>edit
                                </button>
                                <div className="fw-bold">{this.state.title}</div>
                                <div>{this.state.year}</div>
                                <div>{this.state.medium}</div>
                                <PriceFormatter value={this.state.price} saleDate={this.state.saleDate}/>
                            </div>
                        </div>
                    </div>
                    <div className="align-self-end ps-0 col-lg-1 col-1">
                        <FontAwesomeIcon icon={faInfoCircle} onClick={this.toggleShowInfo}/>
                    </div>
                </div>
            );
        }
    }
}

export default Artwork
