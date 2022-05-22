import React from "react"

class FadeOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isShown: props.isShown }
        this.setShowingAlert = this.setShowingAlert.bind(this)
    }

    componentDidUpdate(prevProps) {
        if(this.props.isShown !== prevProps.isShown) {
            this.setState({ isShown: this.props.isShown });
        }
    }

    setShowingAlert(e) {
        if(this.state.isShown) {
            this.setState({
                isShown: false
            })
        } else {
            e.target.classList.add("d-none");
        }
    }

    render() {
        return (
            <div className={`d-flex position-fixed bottom-2 end-2 alert alert-success ${this.state.isShown ? 'alert-shown' : 'alert-hidden'}`}
                 onTransitionEnd={this.setShowingAlert}>{this.props.message}</div>

        );

    }
}

export default FadeOut;