import React from "react"
import { ButtonGroup, Stack, ToggleButton } from "react-bootstrap"
import { SketchPicker } from 'react-color';

interface IDrawingUtilitiesProps {
    width: number;
    onWidthChange: (width: number) => void;
    color: string;
    onColorChange: (color: string) => void;
}

const DrawingUtilities: React.FC<IDrawingUtilitiesProps> = ({ color, width, onWidthChange, onColorChange }) => {
    return (
        <Stack gap={1}>
            <ButtonGroup>
                {[2, 4, 8, 16, 50].map((widthOption) => (
                    <ToggleButton
                        id={widthOption.toString()}
                        key={widthOption}
                        type={'radio'}
                        value={widthOption}
                        variant={'outline-success'}
                        checked={width === widthOption}
                        onChange={(e) => onWidthChange(Number(e.currentTarget.value))}
                    >
                        {widthOption}
                    </ToggleButton>
                ))}
            </ButtonGroup>
            <SketchPicker
                className={'mt-1 align-self-center'}
                color={color}
                onChange={(newColor) => onColorChange(newColor.hex)}
                onChangeComplete={(newColor) => onColorChange(newColor.hex)}
            />
        </Stack>
    )
}

export default DrawingUtilities;