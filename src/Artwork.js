import React from "react"
import { useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Col, Stack } from 'react-bootstrap';

const Artwork = ({attributes, isRotating}) => {
    const [isShowingInfo, setIsShowingInfo] = useState(true);
    const toggleShowInfo = () => setIsShowingInfo(!isShowingInfo);

    return (
        <React.Fragment>
            <Col xs='12'>
                <MovingColorImage isRotating={isRotating} src={attributes.image} title={attributes.title} />
                <Stack className='mt-1'>
                    <FontAwesomeIcon className='ms-auto' icon={isShowingInfo ? faTimesCircle : faInfoCircle} onClick={() => toggleShowInfo()}/>
                    {isShowingInfo ?
                        (
                            <Stack>
                                <div className='ms-auto fw-bold'>{attributes.title}</div>
                                <div className='ms-auto'>{attributes.year}</div>
                                <div className='ms-auto'>{attributes.medium}</div>
                                <PriceFormatter classes='ms-auto' value={attributes.price} saleDate={attributes.saleDate}/>
                            </Stack>
                        ) : null}
                </Stack>
            </Col>
        </React.Fragment>
    );
}

export default Artwork;
