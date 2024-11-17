import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Form, Modal, Navbar, Offcanvas, Stack } from 'react-bootstrap';
import { TfiEraser } from 'react-icons/tfi'
import { BiUndo } from 'react-icons/bi'
import './Canvas.css';
import DrawingUtilities from '../Drawing/DrawingUtilities';
import useScreenSize from '../../hooks/useScreenSize';
import { RiSettings5Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import useKeyPress from '../../hooks/useKeyPress';
import { RGBColor } from 'react-color';

interface ICoords {
    x: number;
    y: number;
};

interface CanvasParams {
    isLoading?: boolean;
}

interface ILine {
    color: string;
    width: number;
    from: ICoords;
    to: ICoords;
}

interface IHistory {
    lines: Array<ILine>;
    current?: number;
}

const Canvas: React.FC<CanvasParams> = ({ isLoading }) => {
    const [history, setHistory] = useState<IHistory>({ lines: [] });
    const [lineWidth, setLineWidth] = useState(8);
    const [color, setColor] = useState<RGBColor>({ r: 0, g: 0, b: 250, a: 1 });
    const getColorString = (rgba: RGBColor) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    const [showDrawingUtilities, setShowDrawingUtilities] = useState(false);
    const [isShowingModal, setIsShowingModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const navigateTo = useNavigate();
    const { height, width } = useScreenSize();
    const imageSrc = useMemo(() => imageFile !== null ? window.URL.createObjectURL(imageFile) : '', [imageFile]);;
    const image = useMemo(() => {
        const i = new Image();
        i.src = imageSrc;
        return i;
    }, [imageSrc]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [previousCoords, setPreviousCoords] = useState<ICoords>({ x: -1, y: -1 });
    const [isClickingOrTouching, setIsClickingOrTouching] = useState(false);
    const menuHotKeyPressed = useKeyPress('m', true);
    const undoPressed = useKeyPress('ArrowLeft', true);

    const onMove = (canvasRef: React.RefObject<HTMLCanvasElement>, x: number, y: number) => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const rect = canvas.getBoundingClientRect();
            const newX = x - rect.left;
            const newY = y - rect.top;
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.fillStyle = getColorString(color);
                ctx.beginPath();
                ctx.moveTo(previousCoords.x, previousCoords.y);
                if (isClickingOrTouching) {
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = getColorString(color);
                    ctx.lineTo(newX, newY);
                    ctx.stroke();
                }
                const newCoords: ICoords = { x: newX, y: newY };
                setHistory((prev) => {
                    const lines = prev.lines.filter((_, index) => index <= (prev.current ?? 0));
                    const newLines = [
                        ...lines,
                        {
                            color: getColorString(color),
                            width: lineWidth,
                            from: previousCoords,
                            to: newCoords
                        }
                    ];
                    return {
                        lines: newLines,
                        current: newLines.length - 1
                    }
                });

                setPreviousCoords(newCoords);
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

    const undo = useCallback((steps = 10) => {
        if (!history.current || history.current < 0) {
            return;
        }
        const linesToUndo = history.lines.length < steps ? history.lines.length : steps;
        const newCurrent = history.current - linesToUndo;
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (image !== null) {
                    drawImageScaled(image, ctx);
                }
                const linesToDraw = history.lines.filter((_, index) => index <= newCurrent);
                linesToDraw.forEach((line) => {
                    ctx.fillStyle = line.color;
                    ctx.beginPath();
                    ctx.moveTo(line.from.x, line.from.y);
                    ctx.lineWidth = line.width;
                    ctx.strokeStyle = line.color;
                    ctx.lineTo(line.to.x, line.to.y);
                    ctx.stroke();
                });
            }
            setHistory((prev) => ({
                ...prev,
                current: newCurrent
            }));
        }
    }, [history, setHistory]);

    const drawImageScaled = (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
        var canvas = ctx.canvas;
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }

    useEffect(() => {
        if (menuHotKeyPressed) {
            setShowDrawingUtilities(!showDrawingUtilities);
        }
    }, [menuHotKeyPressed]);

    useEffect(() => {
        if (undoPressed) {
            undo();
        }
    }, [undoPressed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.clearRect(0, 0, width, height);
                image.onload = () => drawImageScaled(image, ctx);
            }
        }
    }, [image, canvasRef]);

    useEffect(() => {
        initializeCanvas();
    }, [canvasRef]);

    return (
        <React.Fragment>
            {!isShowingModal
                ? (
                    <Button
                        className={'position-absolute top-50 start-50 translate-middle'}
                        onClick={() => setIsShowingModal(true)}
                    >
                        {'Launch'}
                    </Button>
                ) : null}
            <Modal show={isShowingModal} onHide={() => setIsShowingModal(false)} fullscreen={true}>
                <canvas
                    width={width}
                    height={height}
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
                    style={{
                        border: '2px solid turquoise',
                        overflow: 'hidden'
                    }}
                />
                <Button
                    className='position-fixed me-auto'
                    onClick={() => setShowDrawingUtilities(!showDrawingUtilities)}
                    variant={'outline'}
                >
                    <RiSettings5Fill />
                </Button>
                <Navbar.Offcanvas
                    onHide={() => setShowDrawingUtilities(!showDrawingUtilities)}
                    show={showDrawingUtilities}
                    scroll={true}
                    style={{
                        zIndex: 11111
                    }}
                >
                    <Offcanvas.Header
                        className={'pb-0'}
                        onHide={() => setShowDrawingUtilities(!showDrawingUtilities)}
                        closeButton
                    >
                        <Stack
                            gap={2}
                            direction={'horizontal'}
                            className={'me-auto text-center'}
                        >
                            <p>
                                {'Drawing Settings'}
                            </p>
                            <p>
                                {'[ctrl + m]'}
                            </p>
                        </Stack>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Stack gap={1}>
                            <Stack direction={'horizontal'} gap={1}>
                                <Button onClick={() => undo(history.lines.length)}>
                                    <h4><TfiEraser /></h4>
                                </Button>
                                <Button onClick={() => undo()}>
                                    <h4><BiUndo /></h4>
                                </Button>
                            </Stack>
                            <DrawingUtilities
                                color={color}
                                onColorChange={setColor}
                                width={lineWidth}
                                onWidthChange={setLineWidth}
                            />
                            <Form.Group>
                                <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target?.files?.length ? setImageFile(e.target.files[0]) : null} />
                            </Form.Group>
                            <Button
                                className={'m-1 position-absolute bottom-0 end-0'}
                                size={'sm'}
                                onClick={() => navigateTo('/nomophobia/home')}
                            >
                                {'Exit to site'}
                            </Button>
                        </Stack>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Modal>
        </React.Fragment>
    )
};

export default Canvas;