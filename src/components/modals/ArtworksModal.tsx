import * as React from 'react';
import { IArtwork, isSold } from '../../models/Artwork';
import MovingColorImage from '../MovingColorImage';
import { getImageSrc } from '../../models/Artwork';
import { Carousel, CarouselItem, CloseButton, Modal, Offcanvas, OffcanvasBody, Stack } from 'react-bootstrap';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PriceFormatter from '../PriceFormatter';
import './ArtworksModal.css';

interface IArtworksModal {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    initialIndex: number;
    artworks: Array<IArtwork>;
}

const ArtworksModal: React.FC<IArtworksModal> = ({ isOpen, setIsOpen, initialIndex, artworks }) => {
    const [index, setIndex] = useState(initialIndex);

    useEffect(() => setIndex(initialIndex), [initialIndex]);

    return (
        <Offcanvas
            show={isOpen}
            onHide={() => setIsOpen(false)}
            placement={'bottom'}
            style={{
                height: '100vh'
            }}
        >
            <Offcanvas.Body>
                <Stack
                    direction={'vertical'}
                    gap={1}
                >
                    <CloseButton
                        className={'ms-auto'}
                        onClick={() => setIsOpen(false)}
                    />
                    <Carousel
                        interval={null}
                        activeIndex={index}
                        onSelect={(selectedIndex) => setIndex(selectedIndex)}
                    >
                        {artworks.map((artwork, i) => {
                            return (
                                <CarouselItem
                                    key={i}
                                >
                                    <Stack direction={'vertical'}>
                                        <Stack
                                            direction={'horizontal'}
                                            gap={3}
                                        >
                                            <img
                                                src={getImageSrc(artwork.images)}
                                                style={{
                                                    maxHeight: '80vh'
                                                }}
                                            />
                                            <Stack className={'d-flex flex-column-reverse'}>
                                                <Stack
                                                    gap={2}
                                                    direction={'horizontal'}
                                                >
                                                    <PriceFormatter price={artwork.price} isSold={isSold(artwork)} />
                                                </Stack>
                                                <div>{artwork.media}</div>
                                                <div>{artwork.year}</div>
                                                <div className='fw-bold'>{artwork.title}</div>
                                            </Stack>
                                        </Stack>
                                        <div style={{ height: '3rem' }}></div>
                                    </Stack>
                                </CarouselItem>
                            );
                        })}
                    </Carousel>
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ArtworksModal;