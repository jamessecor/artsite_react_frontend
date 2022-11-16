import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface ICoords {
    x: number;
    y: number;
};

const Canvas = ({ onClearCanvas, isLoading, clear, setClear, width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [previousCoords, setPreviousCoords] = useState<ICoords>({x: -1, y: -1});
    
    const onMove = (canvasRef: React.RefObject<HTMLCanvasElement>, x: number, y: number) => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const rect = canvas.getBoundingClientRect();
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.fillStyle = '#dd4488';
                ctx.beginPath();
                ctx.moveTo(previousCoords.x, previousCoords.y);
                const absDiffX = Math.abs((x - rect.left) - previousCoords.x);
                const absDiffY = Math.abs((y - rect.top) - previousCoords.y);
                if (absDiffX < 35 && absDiffY < 35) {
                    ctx.lineTo(x - rect.left, y - rect.top)
                    ctx.stroke();
                }
                setPreviousCoords({
                    x: x - rect.left,
                    y: y - rect.top
                });
            }
        }
    };

    const onTouchMove = (canvasRef: React.RefObject<HTMLCanvasElement>, e: React.TouchEvent<HTMLCanvasElement>) => {
        onMove(canvasRef, e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
    
    const onMouseMove = (canvasRef: React.RefObject<HTMLCanvasElement>, e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        onMove(canvasRef, e.clientX, e.clientY);
    }

    const initializeCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            // ...then set the internal size to match
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.fillStyle = 'lightgreen';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        }
    };

    const resetCanvas = (color = 'lightgreen') => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.fillStyle = color;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        }
        setClear(false);
    };

    useEffect(() => {
        initializeCanvas();
    }, [canvasRef]);

    useEffect(() => {
        const color = isLoading ? 'grey' : '#d6faff';
        resetCanvas(color);
    }, [clear, isLoading]);

    return (
        <div className={'d-flex w-100'}>
            <canvas
                // style={{width: '100%', height: '100%', overscrollBehavior: 'contain'}}
                width={width}
                height={height}
                onTouchMove={(e) => isLoading ? {} : onTouchMove(canvasRef, e)}
                onMouseMove={(e) => isLoading ? {} : onMouseMove(canvasRef, e)}
                ref={canvasRef}
                draggable={true}
            />
            <Button className={'position-absolute btn btn-dark phone-app-button'} onClick={() => onClearCanvas()}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </div>
    )
};

export default Canvas;