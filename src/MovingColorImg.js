import React from 'react';

class MovingColorImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalId: null,
            rotationAmount: props.isRotating === undefined || !props.isRotating ? 0 : Math.random() * 360,
            isRotating: props.isRotating,
            imgClass: props.imgClass === undefined ? "w-100" : props.imgClass
        };
        this.setInterval = this.setInterval.bind(this);
        this.clearInterval = this.clearInterval.bind(this);
        this.toggleInterval = this.toggleInterval.bind(this);
    }

    componentDidMount() {
        if(this.state.isRotating) {
            this.setInterval();
        }
    }

    componentWillUnmount() {
        this.clearInterval();
    }

    toggleInterval() {
        if (this.state.isRotating) {
            this.clearInterval();
        } else {
            this.setInterval();
        }
    }

    clearInterval() {
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.setState({
                isRotating: false,
                rotationAmount: 0
            });
        }
    }

    setInterval() {
        this.setState({
            isRotating: true,
            intervalId: setInterval(() => {
                let newRotationAmount = this.state.rotationAmount + 3;
                if (this.state.rotationAmount > 360) {
                    newRotationAmount = 0;
                }
                this.setState({
                    rotationAmount: newRotationAmount
                });
            })
        });
    }

    render() {
        return (
            <img alt="not found" onClick={this.toggleInterval} className={this.state.imgClass}
                 style={{filter: 'hue-rotate(' + this.state.rotationAmount + 'deg)'}} src={this.props.src}/>
        )
    }
}

export default MovingColorImg;