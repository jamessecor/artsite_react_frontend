import * as React from 'react';
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import './Color.css';

interface IColorProps {
    highlightColor: {
        red: number;
        green: number;
        blue: number;
    }
}

const Color: React.FC<IColorProps> = ({ highlightColor }) => {
    const [color, setColor] = useState({
        red: Math.random() * 255,
        green: Math.random() * 255,
        blue: Math.random() * 255,
    });

    const [isRotating, setIsRotating] = useState(true);
    const [zIndex, setZIndex] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(0);

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    // Set the drag hook and define component movement based on gesture data
    const bind = useDrag(({ event, down, movement: [mx, my] }) => {
        event.preventDefault();
        setColor(highlightColor);
        setIsRotating(false);
        setZIndex(1);
        api.start({ x: currentX + mx, y: currentY + my, immediate: down });
        if (!down) {
            setCurrentX((prev) => mx + prev);
            setCurrentY((prev) => my + prev);
        }
        // api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });
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
                zIndex: zIndex
            }}
            className={`${isRotating ? 'rotatingColor' : ''} color w-100`}
        />
    )
}

export default Color;