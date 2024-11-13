import * as React from 'react';
import { useEffect, useState } from 'react';

interface IKeyPressProps {
    targetKey: string;
    targetCtrlKey?: boolean;
}

const useKeyPress = (targetKey, targetCtrlKey = false) => {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key, ctrlKey }) {
        if (key === targetKey && ctrlKey === targetCtrlKey) {
            setKeyPressed(true);
        }
    }

    function upHandler({ key, ctrlKey }) {
        if (key === targetKey && ctrlKey === targetCtrlKey) {
            setKeyPressed(false);
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    return keyPressed;
};

export default useKeyPress;