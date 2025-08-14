import { useState, useCallback } from 'react';

export const useColor = (initialColor: string, highlightColor: string) => {
  const [color, setColor] = useState(initialColor);
  const [isRotating, setIsRotating] = useState(true);
  const [timesMoved, setTimesMoved] = useState(0);

  const handleStart = useCallback(() => {
    setColor(highlightColor);
    setTimesMoved(prev => prev + 1);
    setIsRotating(false);
  }, [highlightColor]);

  const handleStop = useCallback(() => {
    setColor(initialColor);
    // setIsRotating(true);
  }, [initialColor]);

  return {
    color,
    isRotating,
    timesMoved,
    handleStart,
    handleStop
  };
};