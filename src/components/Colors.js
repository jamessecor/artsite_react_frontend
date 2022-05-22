import React from 'react'
import Color from "./Color";
import {colorOptions} from "../data/color_options";

class Colors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightColor: {r: 200, g: 200, b: 0}
        }
        this.handleChooseColor = this.handleChooseColor.bind(this);
    }

    componentDidMount() {
        this.scrollEl.scrollIntoView({behavior: "smooth"});
    }

    handleChooseColor(e) {
        e.preventDefault();
        this.setState({
            highlightColor: {
                r: e.target.dataset.r,
                g: e.target.dataset.g,
                b: e.target.dataset.b
            }
        });
    }

    render() {
        return (
            <div>
                <div className="d-flex flex-row h-100">
                    Choose Your Color
                    {/* Add a few colors to choose to be how it changes */}
                    <div className="row col-3" ref={(el) => this.scrollEl = el}>
                        <div className="d-flex">
                            {
                                colorOptions.map((color) => {
                                    return (
                                        <div key={`${color.r}${color.g}${color.b}`}
                                             onClick={this.handleChooseColor}
                                             data-r={color.r} data-g={color.g} data-b={color.b}
                                             style={{
                                                 filter: 'blur(1px)',
                                                 background: `rgb(${color.r},${color.g},${color.b})`
                                             }}
                                             className="color w-50"></div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="row vh-100 g-0 container-fluid">
                    {[...Array(108)].map((value, index) => {
                        return (
                            <div key={index} className="col-1">
                                <div className="d-flex h-100">
                                    <Color key={`color-a-${index}`} highlightColor={this.state.highlightColor}/>
                                    <Color key={`color-b-${index}`} highlightColor={this.state.highlightColor}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Colors;