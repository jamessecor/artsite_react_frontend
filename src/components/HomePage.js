import * as React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';
import MovingColorImage from "./MovingColorImage";
import './HomePage.css';

const HomePage = () => {
    const navigateTo = useNavigate();
    const { randomArtwork } = useArtworks();
    const artwork = useMemo(() => randomArtwork(), []);
    const enterSite = () => {
        navigateTo('/artworks?year=2022');
    }

    return (
        <div className='imageContainer' onClick={enterSite}>
            {
                randomArtwork 
                    ? <MovingColorImage src={artwork.image} title={artwork.title} startsWithRotating={true} />
                    : null
            }
            <Button variant='outline-primary' size='lg' className="position-absolute top-50 start-50 translate-middle" onClick={enterSite}>Enter Site</Button>
        </div>
    );    
}

export default HomePage;