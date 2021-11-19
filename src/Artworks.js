import React from 'react'
import Artwork from "./Artwork";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faToggleOn, faToggleOff, faInfoCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'

class Artworks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            artworks: props.artworks,
            isLoggedIn: props.isLoggedIn,
            isRotating: false,
            isShowingInfo: false
        };
        this.toggleAttribute = this.toggleAttribute.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.artworks !== prevProps.artworks) {
            this.setState({artworks: this.props.artworks});
        }
        if (this.props.isLoggedIn !== prevProps.isLoggedIn) {
            this.setState({isLoggedIn: this.props.isLoggedIn});
        }
        if (this.props.isRotating !== prevProps.isRotating) {
            this.setState({isRotating: this.props.isRotating});
        }
    }

    toggleAttribute(attribute, e) {
        e.preventDefault();
        this.setState(prevState => ({
            [attribute]: !prevState[attribute]
        }));
    }

    render() {
        return (
            <div>
                <span onClick={(e) => this.toggleAttribute("isRotating", e)}>
                    <FontAwesomeIcon icon={this.state.isRotating ? faToggleOn : faToggleOff}/>
                    {/*<FontAwesomeIcon icon={this.state.isRotating ? faTeeth : faTeethOpen}/>*/}
                    <span className="ms-1">{this.state.isRotating ? "normal, please" : "rainbow time!"}</span>
                </span>
                <span className="ps-3" onClick={(e) => this.toggleAttribute("isShowingInfo", e)}>
                    <FontAwesomeIcon icon={this.state.isShowingInfo ? faTimesCircle : faInfoCircle}/>
                    <span className="ms-1">{this.state.isShowingInfo ? "hide info" : "show all info"}</span>
                </span>
                <div className="row align-items-center">
                    {this.state.artworks.map((artwork, i) => {
                        return (
                            <div key={artwork.id} className="col-lg-4 col-12 mb-4">
                                <div key={artwork.id}>
                                    <Artwork isShowingInfo={this.state.isShowingInfo} isRotating={this.state.isRotating}
                                             key={artwork.id} attributes={artwork} isEditable={this.state.isLoggedIn}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Artworks;