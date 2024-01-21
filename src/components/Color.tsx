import * as React from 'react';
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import './Color.css';

const Color = ({ highlightColor }) => {
    const [color, setColor] = useState({
        red: Math.random() * 255,
        green: Math.random() * 255,
        blue: Math.random() * 255,
    });

    const [isRotating, setIsRotating] = useState(true);

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    // Set the drag hook and define component movement based on gesture data
    const bind = useDrag(({ event, down, movement: [mx, my] }) => {
        event.preventDefault();
        setIsRotating(false);
        setColor({
            red: 255,
            green: 0,
            blue: 0
        });
        api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
    });

    // Bind it to a component
    return (
        <animated.div
            {...bind()}
            style={{
                x,
                y,
                touchAction: 'none',
                background: `rgb(${color.red},${color.green},${color.blue}`,
                borderRadius: '4px',
                margin: '1px'
            }}
            className={`${isRotating ? 'rotatingColor' : ''} color w-100`}
        /> // w-50 so 2 fit per col
    )
}

export default Color;