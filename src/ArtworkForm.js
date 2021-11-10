import React from "react"
import Artwork from "./Artwork"
class ArtworkForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isHidden: true };
        this.handleClick = this.handleClick.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
    }

    handleClick(e) {
    }

    toggleForm() {
        this.setState(prevState => ({
            isHidden: !prevState.isHidden
        }));
    }

    render () {
        return (
            <div>
              {/*<button className="btn btn-primary" type="button" onClick={this.toggleForm}>{this.state.isHidden ? 'Show Form' : 'Hide'}</button>*/}
                <Artwork isEditable={true} isNew={true} />
            </div>
        );
    }
}

export default ArtworkForm
