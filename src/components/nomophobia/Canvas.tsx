import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Form, Modal, Navbar, Offcanvas, Stack } from 'react-bootstrap';
import { TfiEraser } from 'react-icons/tfi'
import { BiRedo, BiUndo } from 'react-icons/bi'
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
    order: number;
    type: 'line' | 'eraser';
    from: ICoords;
    to: ICoords;
}

interface IHistory {
    actions: Array<ILine>;
    current: number;
}

const Canvas: React.FC<CanvasParams> = ({ isLoading }) => {
    const DEFAULT_STEPS = 10;
    const [lineOrder, setLineOrder] = useState(0);
    const [history, setHistory] = useState<IHistory>({ actions: [], current: 0 });
    const [lineWidth, setLineWidth] = useState(8);
    const [color, setColor] = useState<RGBColor>({ r: 0, g: 0, b: 250, a: 1 });
    const getColorString = (rgba: RGBColor) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    const [showDrawingUtilities, setShowDrawingUtilities] = useState(false);
    const [isShowingModal, setIsShowingModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isErasing, setIsErasing] = useState(false);
    const navigateTo = useNavigate();
    const { height, width, isMobile } = useScreenSize();
    const imageSrc = useMemo(() => imageFile !== null ? window.URL.createObjectURL(imageFile) : '', [imageFile]);;
    const image = useMemo(() => {
        const i = new Image();
        i.src = imageSrc;
        return i;
    }, [imageSrc]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const [previousCoords, setPreviousCoords] = useState<ICoords>({ x: -1, y: -1 });
    const [isClickingOrTouching, setIsClickingOrTouching] = useState(false);

    const menuHotKeyPressed = useKeyPress('g', false);
    const undoPressed = useKeyPress('ArrowLeft', true);
    const redoPressed = useKeyPress('ArrowRight', true);
    const drawingPressed = useKeyPress('d', false);
    const eraserPressed = useKeyPress('e', false);
    const tinyPressed = useKeyPress('1', false);
    const smallPressed = useKeyPress('2', false);
    const mediumPressed = useKeyPress('3', false);
    const largePressed = useKeyPress('4', false);
    const hugePressed = useKeyPress('5', false);

    const drawLine = (ctx: CanvasRenderingContext2D, line: ILine) => {
        ctx.fillStyle = line.color;
        ctx.beginPath();
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineWidth = line.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = line.color;
        ctx.lineTo(line.to.x, line.to.y);
        ctx.stroke();
    };

    const eraseLine = (ctx: CanvasRenderingContext2D, line: ILine) => {
        // Save the current context state
        ctx.save();

        // Set the composite operation to 'destination-out' which makes pixels transparent
        ctx.globalCompositeOperation = 'destination-out';

        // Set the line properties to match the eraser size
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // The color doesn't matter, but alpha does
        ctx.lineWidth = line.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(line.to.x, line.to.y);
        ctx.stroke();

        // Restore the context to its original state
        ctx.restore();
    };

    const onMove = (canvasRef: React.RefObject<HTMLCanvasElement>, x: number, y: number) => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const rect = canvas.getBoundingClientRect();
            const newX = x - rect.left;
            const newY = y - rect.top;
            const ctx = canvas.getContext('2d');
            const newLineOrder = lineOrder + 1;
            if (ctx !== null) {
                const newCoords: ICoords = { x: newX, y: newY };
                const newLine: ILine = {
                    color: getColorString(color),
                    width: lineWidth,
                    type: isErasing ? 'eraser' : 'line',
                    order: newLineOrder,
                    from: previousCoords,
                    to: newCoords
                };
                if (isErasing) {
                    eraseLine(ctx, newLine);
                } else {
                    drawLine(ctx, newLine);
                }

                setHistory((prev: IHistory) => {
                    const actions = prev.actions.filter((_, index) => index <= (prev.current ?? 0));
                    const newActions = [
                        ...actions,
                        newLine
                    ];
                    return {
                        actions: newActions,
                        current: newActions.length - 1
                    }
                });
                setLineOrder(newLineOrder);
                setPreviousCoords(newCoords);
            }
        }
    };

    const onTouchMove = (canvasRef: React.RefObject<HTMLCanvasElement>, e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
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

    const undo = useCallback((steps = DEFAULT_STEPS) => {
        setHistory((prev) => ({
            actions: prev.actions,
            current: prev.current - steps
        }));
    }, [setHistory]);

    const redo = useCallback((steps = DEFAULT_STEPS) => {
        setHistory((prev) => ({
            actions: prev.actions,
            current: prev.current + steps
        }));
    }, [setHistory]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                const actions = history.actions.filter((_, index) => index <= history.current);
                actions.forEach((line) => line.type === 'line' ? drawLine(ctx, line) : eraseLine(ctx, line));
            }
        }
    }, [history, canvasRef.current]);

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
        if (redoPressed) {
            redo();
        }
    }, [redoPressed]);

    useEffect(() => {
        if (drawingPressed) {
            setIsErasing(false);
        }
    }, [drawingPressed]);

    useEffect(() => {
        if (eraserPressed) {
            setIsErasing(true);
        }
    }, [eraserPressed]);

    useEffect(() => {
        if (tinyPressed) {
            setLineWidth(2);
        }
    }, [tinyPressed]);

    useEffect(() => {
        if (smallPressed) {
            setLineWidth(4);
        }
    }, [smallPressed]);

    useEffect(() => {
        if (mediumPressed) {
            setLineWidth(8);
        }
    }, [mediumPressed]);

    useEffect(() => {
        if (largePressed) {
            setLineWidth(16);
        }
    }, [largePressed]);

    useEffect(() => {
        if (hugePressed) {
            setLineWidth(50);
        }
    }, [hugePressed]);

    useEffect(() => {
        const canvas = imageCanvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.clearRect(0, 0, width, height);
                image.onload = () => drawImageScaled(image, ctx);
            }
        }
    }, [image, imageCanvasRef.current]);

    useEffect(() => {
        initializeCanvas();
    }, [canvasRef.current]);

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
                    ref={imageCanvasRef}
                    width={width}
                    height={height}
                    className={'position-absolute w-100 h-100 z-index-0'}
                />
                <canvas
                    ref={canvasRef}
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
                    style={{
                        zIndex: 1,
                        overflow: 'hidden',
                        touchAction: 'pinch-zoom'
                    }}
                />
                <Stack
                    direction={'horizontal'}
                    className={'position-fixed w-100'}
                >
                    <Button
                        onClick={() => setShowDrawingUtilities(!showDrawingUtilities)}
                        variant={'outline'}
                    >
                        <RiSettings5Fill />
                    </Button>
                    {isMobile
                        ? (
                            <div className={'ms-auto'}>
                                <Button
                                    onClick={() => undo()}
                                    variant={'outline'}
                                >
                                    <BiUndo />
                                </Button>
                                <Button
                                    onClick={() => redo()}
                                    variant={'outline'}
                                >
                                    <BiRedo />
                                </Button>
                            </div>
                        )
                        : null}
                </Stack>
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
                                <Button onClick={() => setHistory((prev) => ({
                                    actions: [],
                                    current: 0
                                }))}>
                                    <h4><TfiEraser /></h4>
                                </Button>
                                <Button onClick={() => undo()}>
                                    <h4><BiUndo /></h4>
                                </Button>
                                <Button onClick={() => redo()}>
                                    <h4><BiRedo /></h4>
                                </Button>
                            </Stack>
                            <DrawingUtilities
                                color={color}
                                onColorChange={setColor}
                                width={lineWidth}
                                onWidthChange={setLineWidth}
                                isErasing={isErasing}
                                setIsErasing={setIsErasing}
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