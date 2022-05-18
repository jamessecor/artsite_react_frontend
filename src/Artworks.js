import React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Artwork from "./Artwork";
import config from './config.json';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faToggleOn, faToggleOff, faInfoCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import useIsRotating from './hooks/useIsRotating';
import useIsShowingInfo from './hooks/useIsShowingInfo';
import { Button, Col, Container, Row, Stack } from 'react-bootstrap';

const Artworks = () => {
    const [searchParams, _] = useSearchParams();
    const year = searchParams.get('year') ?? '';
    const searchTerm = searchParams.get('search') ?? '';
    const { isRotating, setIsRotating } = useIsRotating();
    const { isShowingInfo, setIsShowingInfo } = useIsShowingInfo();

    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        async function getArtworks(year, searchTerm) {
            let params = [];
            if (searchTerm !== '') {
                params.push(`search=${searchTerm}`);
            } 
            if (year !== '') {
                params.push(`year=${year}`);
            }
            let works = await fetch(`${config.host}api/artworks?${params.join('&')}`,
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    method: "GET"
                }
            );
            setArtworks(await works.json());
        }

        getArtworks(year, searchTerm);
        
    }, [year, searchTerm]);

    return (
        <React.Fragment>
            <Stack gap='1' direction='horizontal' className="position-fixed bottom-0 mx-auto">
                <Button size='sm' variant='outline-info' onClick={() => setIsRotating(!isRotating)}>
                    <FontAwesomeIcon icon={isRotating ? faToggleOn : faToggleOff}/>
                    {/*<FontAwesomeIcon icon={this.state.isRotating ? faTeeth : faTeethOpen}/>*/}
                    <span className="ms-1">{isRotating ? "normal, please" : "rainbow time!"}</span>
                </Button>
                <Button size='sm' variant='outline-info' onClick={() => setIsShowingInfo(!isShowingInfo)}>
                    <FontAwesomeIcon icon={isShowingInfo ? faTimesCircle : faInfoCircle}/>
                    <span className="ms-1">{isShowingInfo ? "hide info" : "show all info"}</span>
                </Button>
            </Stack>
            <Container fluid={'sm'} className="align-items-center mt-5">
                <Row xs={1} lg={3}>
                    {artworks ? 
                        (artworks.map((artwork, i) => {
                            return (
                                <Col key={artwork.id} className="my-4 px-4">
                                    <Artwork 
                                        isShowingInfo={isShowingInfo} 
                                        allAreRotating={isRotating}
                                        key={artwork.id} 
                                        attributes={artwork} 
                                        isEditable={false}
                                    />
                                </Col>
                            )
                    }))
                    : null }
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default Artworks;