import React from 'react';

class PriceFormatter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: isNaN(props.value) ? props.value : `$${props.value}`,
            isSold: props.saleDate !== null && props.saleDate !== undefined
        }
    }

    render() {
        return (
            <div>
                <span className={this.state.isSold ? "text-secondary text-decoration-line-through" : ""}>{this.state.value}</span>
                <span className={this.state.isSold ? "fst-italic ps-1 text-danger" : "d-none"}>sold</span>
            </div>
        )
    }
}

export default PriceFormatter;