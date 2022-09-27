import * as React from "react"
import { useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Col, Stack } from 'react-bootstrap';
import { ArtworkShowingInfoContext } from './Navigation';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./BackgroundColorProvider";

const Artwork = ({attributes}) => {
    const [isShowingThisInfo, setIsShowingThisInfo] = useState(false);

    return (
        <BackgroundColorContext.Consumer>
            {({color, setColor}) => (
                <ArtworkShowingInfoContext.Consumer>
                    {(isShowingInfo) => (
                        <Col xs='12'>
                            <MovingColorImage src={attributes.image} title={attributes.title} />
                            <Stack className='mt-2'>
                                {isShowingInfo ? 
                                    null : (
                                    <FontAwesomeIcon className='ms-auto' icon={isShowingThisInfo ? faTimesCircle : faInfoCircle} onClick={() => setIsShowingThisInfo(!isShowingThisInfo)}/>
                                )}
                                {isShowingInfo || isShowingThisInfo ?
                                    (
                                        <Stack className={isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text': 'light-text'}>
                                            <div className='text-end fw-bold'>{attributes.title}</div>
                                            <div className='text-end'>{attributes.year}</div>
                                            <div className='text-end'>{attributes.media}</div>
                                            <PriceFormatter classes='text-end' price={attributes.price} isSold={attributes.saleDate ?? false}/>
                                        </Stack>
                                    ) : null}
                            </Stack>
                        </Col>
                    )}
                </ArtworkShowingInfoContext.Consumer>
            )}
        </BackgroundColorContext.Consumer>
    );
}

export default Artwork;
