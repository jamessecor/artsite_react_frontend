import React from "react"
import { Button, Stack } from "react-bootstrap"
import { HuePicker } from 'react-color';

interface IDrawingUtilitiesProps {
    onWidthChange: (width: number) => void;
    color: string;
    onColorChange: (color: string) => void;
}

const DrawingUtilities: React.FC<IDrawingUtilitiesProps> = ({ color, onWidthChange, onColorChange }) => {
    return (
        <Stack gap={1}>
            <Stack direction={'horizontal'}>
                {[2, 4, 8, 16, 50].map((width) => (
                    <Button onClick={() => onWidthChange(width)}>
                        {width}
                    </Button>
                ))}
            </Stack>
            <HuePicker
                color={color}
                onChange={(newColor) => onColorChange(newColor.hex)}
                onChangeComplete={(newColor) => onColorChange(newColor.hex)}
            />
        </Stack>
    )
}

export default DrawingUtilities;