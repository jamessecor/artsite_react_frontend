// Color.tsx
import * as React from 'react';
import { useRef } from 'react';
import Draggable from 'react-draggable';
import { useColor } from '../hooks/useColor';
import './Color.css';

interface ColorProps {
    highlightColorHex: string;
    initialColor: string;
}

const Color: React.FC<ColorProps> = React.memo(({ highlightColorHex, initialColor }) => {
    const draggableRef = useRef(null);
    const { color, isRotating, timesMoved, handleStart, handleStop } = useColor(initialColor, highlightColorHex);

    return (
        <Draggable
            onStart={handleStart}
            onStop={handleStop}
            nodeRef={draggableRef}
        >
            <div
                ref={draggableRef}
                className={`color ${isRotating ? 'rotating' : ''}`}
                style={{
                    touchAction: 'none',
                    backgroundColor: color,
                    zIndex: timesMoved
                }}
            />
        </Draggable>
    );
});

export default Color;