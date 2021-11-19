import React from 'react'
import Color from "./Color";

class Colors extends React.Component {
    componentDidMount() {
        this.end.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        return(
            <div className="row vh-100 g-0 container-fluid">
                {[...Array(107)].map(function(value, index) {
                    return (
                        <div key={index} className="col-1">
                            <div className="d-flex h-100">
                                <Color/>
                                <Color/>
                            </div>
                        </div>
                    )
                })}
                {/* Add this last one outside of loop so we can scroll to it */}
                <div ref={(el) => this.end = el} key="lastOne" className="col-1">
                    <div className="d-flex h-100">
                        <Color/>
                        <Color/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Colors;