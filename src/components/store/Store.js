import React, { useState, useEffect } from 'react';
import StoreItem from './StoreItem';
import { Container, Row, Col } from 'react-bootstrap';

const Store = () => {
    const [storeItems, setStoreItems] = useState([]);

    return (
        <Container fluid={'sm'} className="align-items-center">
            <Row>
                <Col xs={12}>
                    Off the Wallabies
                </Col>
            </Row>
            <Row xs={3} md={3}>
                {Object.values(storeItems).map((storeItem) =>
                    <Col xs={12} key={`${storeItem.title}${storeItem.itemNumber}`}>
                        <StoreItem
                                title={storeItem.title}
                                itemNumber={storeItem.itemNumber}
                                imageSrc={storeItem.imageSrc} 
                        />
                    </Col>
                )}
            </Row>
        </Container>
    )
};

export default Store;
