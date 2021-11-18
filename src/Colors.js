import React from 'react'
import Color from "./Color";

class Colors extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div className="row g-0 container-fluid">

                {[...Array(150)].map(function(value, index) {
                    return (
                        <div key={index} className="col-1">
                            <Color/>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Colors;