import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { ImInfo } from 'react-icons/im';
import { Col, Stack } from 'react-bootstrap';
import { ArtworkShowingInfoContext } from './Navigation';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./providers/BackgroundColorProvider";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { IArtwork } from "../models/Artwork";

interface ArtworkParams {
    attributes: IArtwork;
}

const likesSessionName = 'likes';

const Artwork: React.FC<ArtworkParams> = ({ attributes }) => {
    const [isShowingThisInfo, setIsShowingThisInfo] = useState(false);
    const likes: Array<IArtwork> = useMemo(() => JSON.parse(sessionStorage.getItem(likesSessionName) ?? '[]') ?? [], [sessionStorage.getItem(likesSessionName)]);
    const [isLiked, setIsLiked] = useState(likes.filter((like) => like._id === attributes._id).length > 0);

    useEffect(() => {
        // TODO: update likes on server
        if (isLiked) {
            sessionStorage.setItem(likesSessionName, JSON.stringify([...likes, attributes]));
        }
        else {
            sessionStorage.setItem(likesSessionName, JSON.stringify(likes.filter((like) => like._id != attributes._id)));
        }
    }, [isLiked]);

    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                <ArtworkShowingInfoContext.Consumer>
                    {(isShowingInfo) => (
                        <Col xs='12'>
                            <MovingColorImage src={attributes.image} title={attributes.title} />
                            <Stack direction={'horizontal'} className={'mt-2'} style={{ justifyContent: 'space-between' }}>
                                {isShowingInfo ?
                                    null : (
                                        <h3 onClick={() => setIsShowingThisInfo(!isShowingThisInfo)} className={'ms-auto'}><ImInfo /></h3>
                                    )}
                                {isShowingInfo || isShowingThisInfo ?
                                    (
                                        <React.Fragment>
                                            <Stack className={isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text' : 'light-text'}>
                                                <div className='fw-bold'>{attributes.title}</div>
                                                <div>{attributes.year}</div>
                                                <div>{attributes.media}</div>
                                                <PriceFormatter classes={''} price={attributes.price} isSold={Boolean(attributes.saleDate ?? attributes.isNFS)} />
                                            </Stack>
                                            <Stack
                                                onClick={() => setIsLiked(!isLiked)}
                                                className={'mt-1 me-1'}
                                                style={{ alignItems: 'end' }}
                                            >
                                                {isLiked
                                                    ? <BsHeartFill size={'20'} color={'#7755cc'} />
                                                    : <BsHeart size={'20'} color={'#7755cc'} />
                                                }
                                            </Stack>
                                        </React.Fragment>
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
