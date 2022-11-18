import * as React from "react"
import { useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { ImInfo } from 'react-icons/im';
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
                                        <h3 onClick={() => setIsShowingThisInfo(!isShowingThisInfo)} className={'ms-auto'}><ImInfo /></h3>
                                    )}
                                {isShowingInfo || isShowingThisInfo ?
                                    (
                                        <Stack className={isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text': 'light-text'}>
                                            <div className='text-end fw-bold'>{attributes.title}</div>
                                            <div className='text-end'>{attributes.year}</div>
                                            <div className='text-end'>{attributes.media}</div>
                                            <PriceFormatter classes='text-end' price={attributes.price} isSold={attributes.saleDate ?? attributes.isNFS ?? false}/>
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
