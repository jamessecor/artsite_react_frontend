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

    setShowingAlert() {
        if(this.state.isShown) {
            this.setState({
                isShown: false
            })
        }
    }

    render() {
        return (
            <div className={`alert alert-success ${this.state.isShown ? 'alert-shown' : 'alert-hidden'}`}
                 onTransitionEnd={this.setShowingAlert}>{this.props.message}</div>
        );

    }
}

export default FadeOut;