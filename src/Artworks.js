import React from 'react'
import Artwork from "./Artwork";

class Artworks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            artworks: props.artworks,
            isLoggedIn: props.isLoggedIn,
            isRotating: props.isRotating
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.artworks !== prevProps.artworks) {
            this.setState({
                artworks: this.props.artworks,
                isRotating: this.props.isRotating
            });
        }
    }

    render() {
        return (
            <div className="row align-items-center">
                {this.state.artworks.map((artwork, i) => {
                    return (
                        <div key={artwork.id} className="col-lg-3 col-12 mb-4">
                            <div key={artwork.id}>
                                <Artwork isRotating={this.state.isRotating} key={artwork.id} attributes={artwork} isEditable={this.state.isLoggedIn}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Artworks;