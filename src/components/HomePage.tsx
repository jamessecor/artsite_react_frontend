import * as React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';
import MovingColorImage from "./MovingColorImage";
import { BsFillPlayCircleFill, BsPlay, BsPlayCircleFill } from 'react-icons/bs';
import { getImageSrc } from '../models/Artwork';

const HomePage = () => {
    const navigateTo = useNavigate();
    const { artworksQuery: { data: artworks, isPending: isLoadingArtworks } } = useArtworks({
        year: '2022',
        grouping: 'merica',
        search: 'Claimed Land Erupting'
    });

    const artwork = useMemo(() => !isLoadingArtworks && artworks ? artworks[0] : null, [artworks]);
    const imageSrc = useMemo(() => artwork ? getImageSrc(artwork.images) : '', [artwork]);

    const enterSite = () => {
        navigateTo('/artworks/current');
    }

    return (
        <div className='position-absolute top-0 start-0 w-100' onClick={enterSite}>
            {artwork && (
                <MovingColorImage isFullHeightAndWidth={true} src={imageSrc} title={artwork.title} startsWithRotating={true} />
            )}
            <button style={{ background: 'greenyellow', borderRadius: '10px' }} className={'position-absolute top-50 start-50 translate-middle'} onClick={enterSite}>
                <h1>
                    <BsFillPlayCircleFill />
                </h1>
            </button>
            {/* <Toast
                bg={'success'}
                className={'position-absolute top-50 start-50 translate-middle'}
                onClose={enterSite}
            >
                <Toast.Header closeButton={false}>
                    <img src={imageSrc} className="w-25 rounded me-2" alt="" />
                    <strong className='me-auto'>
                        {'James Secor art'}
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
            </Toast> */}
        </div>
    );
}

export default HomePage;