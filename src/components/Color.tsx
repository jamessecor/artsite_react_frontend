import * as React from 'react';
import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import './Color.css';

interface IColorProps {
    highlightColorHex: string;
}

const Color: React.FC<IColorProps> = ({ highlightColorHex }) => {
    const initialColor = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;

    const draggableRef = useRef(null);

    const [color, setColor] = useState(initialColor);
    const [isRotating, setIsRotating] = useState(true);
    const [timesMoved, setTimesMoved] = useState(0);

    const handleStart = () => {
        setColor(highlightColorHex);
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
                className={`${isRotating ? 'rotatingColor' : 'notRotatingColor'} color w-100`}
                style={{
                    touchAction: 'none',
                    background: color,
                    zIndex: timesMoved
                }}
            />
        </Draggable>
    )
}

export default Color;