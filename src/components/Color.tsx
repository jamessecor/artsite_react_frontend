import * as React from 'react';
import { useState } from 'react';
import './Color.css';

const Color = ({ highlightColor }) => {
    const [color, setColor] = useState({
        red: Math.random() * 255,
        green: Math.random() * 255,
        blue: Math.random() * 255,
    });

    const [isRotating, setIsRotating] = useState(true);

    const highlight = () => {
        setIsRotating(false);
        setColor(highlightColor);
    };

    return (
        <div
            onMouseEnter={highlight}
            onMouseLeave={highlight}
            onMouseOver={highlight}
            onTouchStart={highlight}
            onTouchEnd={highlight}
            style={{
                filter: 'blur(25px)',
                background: `rgb(${color.red},${color.green},${color.blue}`,
                borderRadius: '2rem'
            }}
            className={`${isRotating ? 'rotatingColor' : ''} color w-100`}
        /> // w-50 so 2 fit per col
    )
}

export default Color;