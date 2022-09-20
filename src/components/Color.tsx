import * as React, { useState } from 'react';
import './Color.css';

const Color = ({ highlightColor }) => {
    const [red, setRed] = useState(Math.random() * 255);
    const [green, setGreen] = useState(Math.random() * 255);
    const [blue, setBlue] = useState(Math.random() * 255);
    const [isRotating, setIsRotating] = useState(true);

    const handleMouseEnter = () => {
        setIsRotating(false);
        setRed(highlightColor.r);
        setGreen(highlightColor.g);
        setBlue(highlightColor.b);
    };

    const handleMouseLeave = () => {

    };

    return (
        <div 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // onTouchStart={this.clearIntervalAndSetColor}
            // onTouchEnd={this.setInterval}
            style={{
                filter: 'blur(25px)',
                background: `rgb(${red},${green},${blue}`
            }}
            className={`${isRotating ? 'rotatingColor' : ''} color w-50`}
        /> // w-50 so 2 fit per col
    )    
}

export default Color;