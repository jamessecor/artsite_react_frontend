import React from 'react'
import './Color.css'

class Color extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalId: null,
            color: {
                r: Math.random() * 255,
                g: Math.random() * 255,
                b: Math.random() * 255
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

    clearIntervalAndSetColor() {
        if (this.state.intervalId !== null) {
            clearInterval(this.state.intervalId);
            this.setState({
                color: {
                    r: 200,
                    g: 200,
                    b: 0
                }
            });
        }
    }

    setInterval() {
        this.setState({
            intervalId: setInterval(() => {
                let newR = this.state.color.r + 5;
                if (this.state.color.r > 255) {
                    newR = 0;
                }
                let newG = this.state.color.g + 5;
                if (this.state.color.g > 255) {
                    newG = 0;
                }
                let newB = this.state.color.b + 5;
                if (this.state.color.b > 255) {
                    newB = 0;
                }
                this.setState({
                    color: {
                        r: newR,
                        g: newG,
                        b: newB
                    }
                });
            }, 15)
        });
    }

    render() {
        return (
            <div onMouseEnter={this.clearIntervalAndSetColor}
                 onMouseLeave={this.setInterval}
                 onTouchStart={this.clearIntervalAndSetColor}
                 onTouchEnd={this.setInterval}
                 style={{background: `rgb(${this.state.color.r},${this.state.color.g},${this.state.color.b}`}}
                 className="color"></div>
        )
    }
}

export default Color;