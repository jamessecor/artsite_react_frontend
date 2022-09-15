import React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Artwork from "./Artwork";
import useArtworkSettings from '../hooks/useArtworkSettings';
import { Button, Col, Container, Row, Stack, Toast } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';

const Artworks = () => {
    const [searchParams, _] = useSearchParams();
    const year = searchParams.get('year') ?? '';
    const grouping = searchParams.get('grouping') ?? '';
    const searchTerm = searchParams.get('search') ?? '';
    const { isRotatingAll, isShowingInfoAll } = useArtworkSettings();
    const {artworks, setEm} = useArtworks();
    
    useEffect(() => {
        setEm(year, grouping, searchTerm);
    }, [setEm, year, grouping, searchTerm]);
    
    return (
        <Container fluid={'sm'} className="align-items-center">
            <Row xs={1} lg={3}>
                {artworks.length
                    ? (artworks.map((artwork, i) => {
                        return (
                            <Col key={`${artwork.id}-${artwork.title}`} className="my-4 px-4">
                                <Artwork 
                                    isShowingInfo={isShowingInfoAll} 
                                    allAreRotating={isRotatingAll}
                                    attributes={artwork} 
                                    isEditable={false}
                                />
                            </Col>
                        )
                    }))
                    : (
                        <Container className={'align-items-center'}>
                            <Row xs={1}>
                                <Col>
                                    <Toast bg='warning'>
                                        <Toast.Header>
                                            <strong className='me-auto'>
                                                {'No artworks found :('}
                                            </strong>
                                        </Toast.Header>
                                        <Toast.Body>
                                            {'Please try another search or click select a different menu option.'}
                                        </Toast.Body>
                                    </Toast>  
                                </Col>
                            </Row>
                        </Container>
                    )}
            </Row>
        </Container>
    );
};

export default Artworks;