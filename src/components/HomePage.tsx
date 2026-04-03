import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigateTo = useNavigate();
    const [flashingStates, setFlashingStates] = useState<boolean[]>(Array(16).fill(false));
    const [enterButtonIndex] = useState(Math.floor(Math.random() * 16));

    // Harmonious color palette for 4x4 grid
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
        '#85C1E2', '#F8B739', '#52B788', '#E8B4B8',
        '#B4A7D6', '#93C47D', '#F4A460', '#87CEEB'
    ];

    useEffect(() => {
        const intervals = flashingStates.map((_, index) => {
            return setInterval(() => {
                setFlashingStates(prev => {
                    const newStates = [...prev];
                    newStates[index] = !newStates[index];
                    return newStates;
                });
            }, 2000 + Math.random() * 2000); // Random flash interval between 2-4 seconds
        });

        return () => intervals.forEach(interval => clearInterval(interval));
    }, []);

    const enterSite = () => {
        navigateTo('/artworks/current');
    }

    return (
        <div 
            style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw', 
                height: '100vh', 
                backgroundColor: '#1a1a1a',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                zIndex: 9999
            }}
        >
            <div className='d-flex align-items-center justify-content-center w-100 h-100'>
                <div className='d-grid' style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', padding: '2rem' }}>
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            onClick={index === enterButtonIndex ? enterSite : undefined}
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                opacity: flashingStates[index] ? 0.3 : 1,
                                transition: 'opacity 1.5s ease-in-out',
                                cursor: 'pointer',
                                boxShadow: flashingStates[index] ? 'none' : `0 0 20px ${color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: index === enterButtonIndex ? '#1a1a1a' : 'transparent',
                                fontWeight: 'bold',
                                fontSize: '10px'
                            }}
                        >
                            {index === enterButtonIndex && 'enter'}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;