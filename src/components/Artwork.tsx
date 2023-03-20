import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { ImInfo } from 'react-icons/im';
import { Col, Stack } from 'react-bootstrap';
import { ArtworkShowingInfoContext } from './Navigation';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./providers/BackgroundColorProvider";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { IArtwork } from "../models/Artwork";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ArtworkParams {
    attributes: IArtwork;
}

const likesSessionName = 'likes';
const likesHeartColor = '#cc7766';

const Artwork: React.FC<ArtworkParams> = ({ attributes }) => {
    const [isShowingThisInfo, setIsShowingThisInfo] = useState(false);
    const likes: Array<IArtwork> = useMemo(() => JSON.parse(sessionStorage.getItem(likesSessionName) ?? '[]') ?? [], [sessionStorage.getItem(likesSessionName)]);
    const [isLiked, setIsLiked] = useState(likes.filter((like) => like._id === attributes._id).length > 0);
    const client = useQueryClient();

    useEffect(() => {
        if (isLiked) {
            sessionStorage.setItem(likesSessionName, JSON.stringify([...likes, attributes]));
        }
        else {
            sessionStorage.setItem(likesSessionName, JSON.stringify(likes.filter((like) => like._id != attributes._id)));
        }
    }, [isLiked, attributes]);

    const sendLike = useCallback(() => {
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/artworks/${attributes._id}/likes`, {
            timestamp: new Date().toISOString(),
            amount: isLiked ? 1 : -1
        });
        // TODO update artworks in react-query
        // TODO - useMutation!
        // client.setQueryData(['artworks', { _id: attributes._id }], attributes)
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
                                                onClick={() => {
                                                    setIsLiked(!isLiked);
                                                    sendLike();
                                                }}
                                                className={'mt-1 me-1'}
                                                style={{ alignItems: 'end' }}
                                            >
                                                {isLiked
                                                    ? (
                                                        <Stack className={'align-items-end'} style={{ color: likesHeartColor }}>
                                                            <BsHeartFill size={'20'} color={likesHeartColor} />
                                                            <div style={{ fontSize: '.75rem' }}>
                                                                {attributes.totalLikes}
                                                            </div>
                                                        </Stack>
                                                    ) : (
                                                        <Stack className={'align-items-end'} style={{ color: likesHeartColor }}>
                                                            <BsHeart size={'20'} color={likesHeartColor} />
                                                            <div style={{ fontSize: '.75rem' }}>
                                                                {attributes.totalLikes}
                                                            </div>
                                                        </Stack>
                                                    )}
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
