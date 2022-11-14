import React, { useRef, useEffect } from 'react'

const onTouchMove = (canvasRef: React.RefObject<HTMLCanvasElement>, e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (ctx !== null) {
            ctx.fillStyle = '#dd4488';
            ctx.fillRect(e.targetTouches[0].clientX - rect.left, e.targetTouches[0].clientY - rect.top, 2, 2);
        }
    }
}

const onMouseMove = (canvasRef: React.RefObject<HTMLCanvasElement>, e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (ctx !== null) {
            ctx.fillStyle = '#dd4488';
            ctx.fillRect(e.clientX - rect.left, e.clientY - rect.top, 2, 2);
        }
    }
}

const Canvas = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== null) {
            canvas.style.width ='100%';
            canvas.style.height='100%';
            // ...then set the internal size to match
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            const ctx = canvas.getContext('2d');
            if (ctx !== null) {
                ctx.fillStyle = 'lightgreen';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        }
    }, [canvasRef]);
  
    return <canvas
        onTouchMove={(e) => onTouchMove(canvasRef, e)}
        onMouseMove={(e) => onMouseMove(canvasRef, e)}
        ref={canvasRef}
        {...props}
        draggable={true}
    />
};

export default Canvas;