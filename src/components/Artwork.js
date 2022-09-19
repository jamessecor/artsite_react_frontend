import React from "react"
import { useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Col, Stack } from 'react-bootstrap';
import { ArtworkShowingInfoContext } from './Navigation';

const Artwork = ({attributes}) => {
    const [isShowingThisInfo, setIsShowingThisInfo] = useState();

    return (
        <ArtworkShowingInfoContext.Consumer>
            {(isShowingInfo) => (
                <Col xs='12'>
                    <MovingColorImage src={attributes.image} title={attributes.title} />
                    <Stack className='mt-1'>
                        {isShowingInfo ? 
                            null : (
                            <FontAwesomeIcon className='ms-auto' icon={isShowingThisInfo ? faTimesCircle : faInfoCircle} onClick={() => setIsShowingThisInfo(!isShowingThisInfo)}/>
                        )}
                        {isShowingInfo || isShowingThisInfo ?
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
            )}
        </ArtworkShowingInfoContext.Consumer>
    );
}

export default Artwork;
