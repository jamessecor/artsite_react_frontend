import * as React from 'react';
import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import './Color.css';

interface IColorProps {
    highlightColor: {
        red: number;
        green: number;
        blue: number;
    }
}

const Color: React.FC<IColorProps> = ({ highlightColor }) => {
    const initialColor = {
        red: Math.random() * 255,
        green: Math.random() * 255,
        blue: Math.random() * 255,
    };

    const draggableRef = useRef(null);

    const [color, setColor] = useState(initialColor);
    const [isRotating, setIsRotating] = useState(true);
    const [timesMoved, setTimesMoved] = useState(0);

    const handleStart = () => {
        setColor({ red: 200, green: 10, blue: 10 })
        setTimesMoved((prev) => prev + 1);
        setIsRotating(false);
    }

    const handleStop = () => {
        setColor(initialColor);
        setIsRotating(true);
    }

    return (
        <Draggable
            onStart={handleStart}
            onStop={handleStop}
            nodeRef={draggableRef}
        >
            <div
                ref={draggableRef}
                className={`${isRotating ? 'rotatingColor' : ''} color w-100`}
                style={{
                    touchAction: 'none',
                    background: `rgb(${color.red}, ${color.green}, ${color.blue})`,
                    zIndex: timesMoved
                }}
            />
        </Draggable>
    )
}

export default Color;