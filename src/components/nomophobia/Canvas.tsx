import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Button, Form, Stack } from 'react-bootstrap';
import { TfiEraser } from 'react-icons/tfi'
import './Canvas.css';
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";
import { MdUpload } from 'react-icons/md';
import DrawingUtilities from '../Drawing/DrawingUtilities';

interface ICoords {
    x: number;
    y: number;
};

interface CanvasParams {
    isLoading?: boolean;
}

const Canvas: React.FC<CanvasParams> = ({ isLoading }) => {
    const [clear, setClear] = useState(true);
    const [lineWidth, setLineWidth] = useState(20);
    const [color, setColor] = useState('blue');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const imageSrc = useMemo(() => imageFile !== null ? window.URL.createObjectURL(imageFile) : '', [imageFile]);;
    const image = useMemo(() => {
        const i = new Image();
        i.src = imageSrc;
        return i;
    }, [imageSrc]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [previousCoords, setPreviousCoords] = useState<ICoords>({ x: -1, y: -1 });
    const [isClickingOrTouching, setIsClickingOrTouching] = useState(false);

    const onMove = (canvasRef: React.RefObject<HTMLCanvasElement>, x: number, y: number) => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const rect = canvas.getBoundingClientRect();
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(previousCoords.x, previousCoords.y);
                if (isClickingOrTouching) {
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = color;
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
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                // ctx.fillStyle = isLoading ? 'grey' : `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (image !== null) {
                    ctx.drawImage(image, 0, 0, PHONE_WIDTH, PHONE_HEIGHT);
                }
            }
        }
        setClear(false);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            image.width = canvas.width;
            image.height = canvas.height;
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.clearRect(0, 0, 400, 400);
                image.onload = () => ctx.drawImage(image, 0, 0, PHONE_WIDTH, PHONE_HEIGHT);
            }
        }
    }, [image, canvasRef]);

    useEffect(() => {
        initializeCanvas();
    }, [canvasRef]);

    return (
        <div className={'d-flex w-100'}>
            <canvas
                width={PHONE_WIDTH}
                height={PHONE_HEIGHT}
                onMouseDown={(e) => {
                    if (canvasRef?.current !== null) {
                        const rect = canvasRef?.current.getBoundingClientRect();
                        setPreviousCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }
                    setIsClickingOrTouching(true);
                }}
                onMouseUp={(e) => setIsClickingOrTouching(false)}
                onMouseMove={(e) => !isClickingOrTouching || isLoading ? {} : onMouseMove(canvasRef, e)}
                onTouchStart={(e) => {
                    if (canvasRef?.current !== null) {
                        const rect = canvasRef?.current.getBoundingClientRect();
                        setPreviousCoords({ x: e.targetTouches[0].clientX - rect.left, y: e.targetTouches[0].clientY - rect.top });
                    }
                    setIsClickingOrTouching(true);
                }}
                onTouchEnd={(e) => setIsClickingOrTouching(false)}
                onTouchMove={(e) => isLoading ? {} : onTouchMove(canvasRef, e)}
                ref={canvasRef}
            />
            <Stack gap={1} className={'position-absolute m-3'}>
                <Button onClick={() => resetCanvas()}>
                    <h4><TfiEraser /></h4>
                </Button>

                {/* TODO: maybe move this outside of nomophobia??? */}
                <Form.Group>
                    <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target?.files?.length ? setImageFile(e.target.files[0]) : null} />
                </Form.Group>
                <DrawingUtilities
                    color={color}
                    onColorChange={setColor}
                    onWidthChange={setLineWidth}
                />
            </Stack>
        </div>
    )
};

export default Canvas;