import * as React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';
import MovingColorImage from "./MovingColorImage";

const HomePage = () => {
    const navigateTo = useNavigate();
    const { randomArtwork } = useArtworks();
    const artwork = useMemo(() => randomArtwork(), [randomArtwork]);
    const enterSite = () => {
        navigateTo('/artworks/current');
    }

    return (
        <div className='position-absolute top-0 start-0 w-100' onClick={enterSite}>
            <MovingColorImage isFullHeightAndWidth={true} src={artwork.image} title={artwork.title} startsWithRotating={true} />
            <Button variant='outline-primary' size='lg' className="position-absolute top-50 start-50 translate-middle" onClick={enterSite}>Enter Site</Button>
        </div>
    );    
}

export default HomePage;