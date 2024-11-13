import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Button, Form, Modal, Navbar, Offcanvas, Stack } from 'react-bootstrap';
import { TfiEraser } from 'react-icons/tfi'
import './Canvas.css';
import DrawingUtilities from '../Drawing/DrawingUtilities';
import useScreenSize from '../../hooks/useScreenSize';
import { RiSettings5Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import useKeyPress from '../../hooks/useKeyPress';

interface ICoords {
    x: number;
    y: number;
};

interface CanvasParams {
    isLoading?: boolean;
}

const Canvas: React.FC<CanvasParams> = ({ isLoading }) => {
    // TODO: Keep track of each stroke so we can recreate after clear on undo/redo buttons
    const [clear, setClear] = useState(true);
    const [lineWidth, setLineWidth] = useState(8);
    const [color, setColor] = useState('blue');
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
                    image.width = ctx.canvas.width
                    image.height = ctx.canvas.height;
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                }
            }
        }
        setClear(false);
    };

    useEffect(() => {
        if (menuHotKeyPressed) {
            setShowDrawingUtilities(!showDrawingUtilities);
        }
    }, [menuHotKeyPressed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.clearRect(0, 0, width, height);
                image.width = ctx.canvas.width
                image.height = ctx.canvas.height;
                image.onload = () => ctx.drawImage(image, 0, 0, image.width, image.height);
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
                            <Button onClick={() => resetCanvas()}>
                                <h4><TfiEraser /></h4>
                            </Button>
                            <Form.Group>
                                <Form.Control type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target?.files?.length ? setImageFile(e.target.files[0]) : null} />
                            </Form.Group>
                            <DrawingUtilities
                                color={color}
                                onColorChange={setColor}
                                width={lineWidth}
                                onWidthChange={setLineWidth}
                            />
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