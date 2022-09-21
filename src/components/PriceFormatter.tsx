import * as React from 'react';

interface PriceFormatterParams {
    price: string;
    isSold: boolean;
    classes: string;
}

const PriceFormatter: React.FC<PriceFormatterParams> = ({ price, isSold = false, classes }) => {

    const displayPrice = React.useMemo(() => price.indexOf('\$') >= 0 ? price : `$${price}`, [price])

    return (
        <div className={classes}>
            <span className={isSold ? "text-secondary text-decoration-line-through" : ""}>{displayPrice}</span>
            <span className={isSold ? "fst-italic ps-1 text-danger" : "d-none"}>sold</span>
        </div>
    );
};

export default PriceFormatter;