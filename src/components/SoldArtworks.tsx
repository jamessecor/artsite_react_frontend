import * as React from 'react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Artwork from "./Artwork";
import { Col, Container, Row } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';

const SoldArtworks = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const { soldArtworkByQuarter } = useArtworks();
    const soldArtworks = useMemo(() => soldArtworkByQuarter(startDate, endDate), [soldArtworkByQuarter, startDate, endDate]);
    
    const total = useMemo(() => soldArtworks
        .map((soldArtwork) => soldArtwork.salePrice ?? soldArtwork.price)
        .reduce((sum, b) => sum + parseFloat(b), 0)
    , [soldArtworks]);
    
    return (
        <Container fluid={'sm'} className="align-items-center">
            <Row>
                <Col sm={4}>
                    <input type="date" name="start" onChange={(e) => setStartDate(new Date(e.target.value))}/>
                    <input type="date" name="end" onChange={(e) => setEndDate(new Date(e.target.value))}/>
                </Col>
                {soldArtworks.length 
                    ? soldArtworks.map((artwork, i) => <div>{`${artwork.price} | ${artwork.saleDate} | ${artwork.title}`}</div>)
                    : null}
                TOTAL {total}
                Taxes Owed: {total - (total / 1.06)}
            </Row>
            <Row xs={1} lg={4} className={'d-flex align-items-center'}>
                {soldArtworks.length
                    ? (soldArtworks.map((artwork, i) => {
                        return (
                            <Col key={`${artwork.id}-${artwork.title}`} className="my-4 px-4">
                                <Artwork attributes={artwork} />
                            </Col>
                        )
                    }))
                    : null}
            </Row>
        </Container>
    );
};

export default SoldArtworks;