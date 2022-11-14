import React, { useRef, useEffect } from 'react'

const onTouchMove = (canvasRef: React.RefObject<HTMLCanvasElement>, e) => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (ctx !== null) {
            console.log('rect', rect);
            console.log('fff', e.clientX, e.clientY, e.clientX - rect.left, e.clientY - rect.top);
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
        }
    }, [canvasRef]);
  
    return <canvas
        onTouchMove={(e) => onTouchMove(canvasRef, e)}
        onMouseMove={(e) => onTouchMove(canvasRef, e)}
        ref={canvasRef}
        {...props}
    />
};

export default Canvas;