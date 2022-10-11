import * as React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Toast } from 'react-bootstrap';
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
            <Toast
                className={'position-absolute top-50 start-50 translate-middle'}
                onClose={enterSite}
            >
                <Toast.Header>
                    <img src={artwork.image} className="w-25 rounded me-2" alt="" />
                    <strong className='me-auto'>
                        {'Chirping in the Thickets'}
                    </strong>
                </Toast.Header>
                <Toast.Body className="d-flex flex-column justify-content-center">
                    <div className='d-flex text-center justify-content-center'>
                        {'On view this November at the Front'}
                        <br /> {'6 Barre St, Montpelier, VT'}
                        <br />{'Nov 4 - 27'}
                        <br />{'Opening: Nov 4th, 4-8 pm'}
                    </div>
                    <Button variant='success' size='lg' className={'mt-2'} onClick={enterSite}>Continue</Button>
                </Toast.Body>
            </Toast>
        </div>
    );    
}

export default HomePage;