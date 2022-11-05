import * as React from 'react';
import { useMemo, useState } from 'react';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./BackgroundColorProvider";
import Artwork from "./Artwork";
import { Col, Container, Row } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';

const SoldArtworks = () => {
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(-1);

    const beginningOfMonth = new Date();
    beginningOfMonth.setDate(0);

    const [startDate, setStartDate] = useState(beginningOfMonth);
    const [endDate, setEndDate] = useState(endOfMonth);

    const { soldArtworkByQuarter } = useArtworks();
    const soldArtworks = useMemo(() => soldArtworkByQuarter(startDate, endDate), [soldArtworkByQuarter, startDate, endDate]);
    
    const total = useMemo(() => soldArtworks
        .map((soldArtwork) => soldArtwork.salePrice ?? soldArtwork.price)
        .reduce((sum, b) => sum + parseFloat(b), 0)
    , [soldArtworks]);
    
    return (
        <BackgroundColorContext.Consumer>
            {({color, setColor}) => (
                <Container fluid={'sm'} className="align-items-center">
                    <Row className={isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text': 'light-text'}>
                        <Col sm={4}>
                            <input type="date" name="start" value={startDate.toISOString().substring(0,10)} onChange={(e) => setStartDate(new Date(e.target.value))}/>
                            <input type="date" name="end" value={endDate.toISOString().substring(0,10)} onChange={(e) => setEndDate(new Date(e.target.value))}/>
                        </Col>
                        {soldArtworks.length 
                            ? soldArtworks.map((artwork, i) => <div>{`${artwork.salePrice ?? artwork.price} | ${artwork.saleDate} | ${artwork.title}`}</div>)
                            : null}
                        {total} TOTAL
                        <br/>
                        {total - (total / 1.06)} Taxes Owed
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
            )}
        </BackgroundColorContext.Consumer>

    );
};

export default SoldArtworks;