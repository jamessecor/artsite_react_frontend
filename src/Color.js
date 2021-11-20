import React from 'react'

class Color extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalId: null,
            highlightColor: props.highlightColor,
            color: {
                r: Math.random() * 255,
                g: Math.random() * 255,
                b: Math.random() * 255
            },
            movement: {
                r: Math.random() * -15,
                g: Math.random() * 15,
                b: Math.random() * 15
            }
        };
        this.setInterval = this.setInterval.bind(this);
        this.clearIntervalAndSetColor = this.clearIntervalAndSetColor.bind(this);
    }

    componentDidMount() {
        this.setInterval()
    }

    componentWillUnmount() {
        this.clearIntervalAndSetColor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.highlightColor !== prevState.highlightColor) {
            this.setState({highlightColor: this.props.highlightColor})
        }
    }

    clearIntervalAndSetColor() {
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.setState({
                color: this.state.highlightColor
            });
        }
    }

    setInterval() {
        this.setState({
            intervalId: setInterval(() => {
                let newR = this.state.color.r + this.state.movement.r;
                let moveR = this.state.movement.r;
                if ((this.state.color.r > 245 && this.state.movement.r > 0) || (this.state.color.r < 10 && this.state.movement.r < 0)) {
                    moveR = -1 * this.state.movement.r;
                }
                let newG = this.state.color.g + this.state.movement.g;
                let moveG = this.state.movement.g;
                if ((this.state.color.g > 245 && this.state.movement.g > 0) || (this.state.color.g < 10 && this.state.movement.g < 0)) {
                    moveG = -1 * this.state.movement.g;
                }
                let newB = this.state.color.b + this.state.movement.b;
                let moveB = this.state.movement.b;
                if ((this.state.color.b > 245 && this.state.movement.b > 0) || (this.state.color.b < 10 && this.state.movement.b < 0)) {
                    moveB = -1 * this.state.movement.b;
                }
                this.setState({
                    color: {
                        r: newR,
                        g: newG,
                        b: newB
                    },
                    movement: {
                        r: moveR,
                        g: moveG,
                        b: moveB
                    }
                });
            }, Math.random() * 2500 + 50)
        });
    }

    render() {
        return (
            <div onMouseEnter={this.clearIntervalAndSetColor}
                 onMouseLeave={this.setInterval}
                 onTouchStart={this.clearIntervalAndSetColor}
                 onTouchEnd={this.setInterval}
                 style={{
                     filter: 'blur(1px)',
                     background: `rgb(${this.state.color.r},${this.state.color.g},${this.state.color.b}`
                 }}
                 className="color w-50"></div> // w-50 so 2 fit per col
        )
    }
}

export default Color;