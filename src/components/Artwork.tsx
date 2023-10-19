import * as React from "react"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { ImInfo } from 'react-icons/im';
import { Button, Col, Form, Modal, Spinner, Stack, Toast, ToastContainer } from 'react-bootstrap';
import { ArtworkShowingInfoContext } from './Navigation';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./providers/BackgroundColorProvider";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { getImageSrc, IArtwork, ILike } from "../models/Artwork";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ArtworkParams {
    attributes: IArtwork;
};

interface ISentEmailToastParams {
    showSentEmailToast: boolean;
    setShowSentEmailToast: Dispatch<SetStateAction<boolean>>;
}

interface IArtworkPutLikeResponse {
    data: {
        message: string;
        likes: Array<ILike>;
        totalLikes: number;
    }
};

interface IBuyEmailFormData {
    email: string;
    message: string;
};

interface IArtworkEmailPostResponse {
    data: {
        message: string;
    }

};

const likesSessionName = 'likes';
const likesHeartColor = '#bb9999';

const Artwork: React.FC<ArtworkParams> = ({ attributes }) => {
    const [isShowingThisInfo, setIsShowingThisInfo] = useState(false);
    const likes: Array<IArtwork> = useMemo(() => JSON.parse(sessionStorage.getItem(likesSessionName) ?? '[]') ?? [], []);
    const [isLiked, setIsLiked] = useState(likes.filter((like) => like._id === attributes._id).length > 0);
    const [totalLikes, setTotalLikes] = useState(attributes.totalLikes);
    const amount = useMemo(() => isLiked ? -1 : 1, [isLiked]);
    const imageSrc = useMemo(() => getImageSrc(attributes.images), [attributes]);
    const isSold = useMemo(() => Boolean(attributes.saleDate ?? attributes.isNFS), [attributes]);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showSentEmailToast, setShowSentEmailToast] = useState(false);
    const client = useQueryClient();

    useEffect(() => {
        if (isLiked) {
            sessionStorage.setItem(likesSessionName, JSON.stringify([...likes, attributes]));
        }
        else {
            sessionStorage.setItem(likesSessionName, JSON.stringify(likes.filter((like) => like._id !== attributes._id)));
        }
    }, [isLiked, likes, attributes]);

    const { mutate } = useMutation<IArtworkPutLikeResponse, AxiosError>(_ => {
        return axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${attributes._id}/likes`, {
            timestamp: new Date().toISOString(),
            amount: amount
        });
    }, {
        onSuccess: (data) => {
            // update artwork
            setTotalLikes(data.data.totalLikes);
            client.setQueryData(['artworks', { _id: attributes._id }], {
                ...attributes,
                likes: data.data.likes,
                totalLikes: data.data.totalLikes
            });
        },
        onError: (data) => {
            // hmm, set it back?
            setIsLiked(!isLiked);
        }
    });

    const { mutate: buyMutate, isLoading: isSendingBuyEmail, error: errorSendingBuyEmail } = useMutation<IArtworkEmailPostResponse, AxiosError, IBuyEmailFormData>((formData) => {
        return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/email`, {
            email: formData.email,
            message: formData.message
        });
    }, {
        onSuccess: (data) => {
            setShowBuyModal(false);
            setShowSentEmailToast(true);
        }
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        buyMutate({ email: email, message: message });
    }


    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                <ArtworkShowingInfoContext.Consumer>
                    {(isShowingInfo) => (
                        <Col xs='12'>
                            <SentEmailToast
                                showSentEmailToast={showSentEmailToast}
                                setShowSentEmailToast={setShowSentEmailToast}
                            />
                            <Modal
                                show={showBuyModal}
                                onHide={() => setShowBuyModal(false)}
                            >
                                <Modal.Header
                                    closeButton
                                    className={'light-text'}
                                >
                                    {'I\'d like to buy...'}
                                </Modal.Header>
                                <Modal.Body className={'light-text'}>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label>{'Email Address'}</Form.Label>
                                            <Form.Control disabled={isSendingBuyEmail} required placeholder={'my-email@example.com'} name='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="message">
                                            <Form.Label>{'Message'}</Form.Label>
                                            <Form.Control disabled={isSendingBuyEmail} rows={3} as="textarea" name='message' value={message} onChange={(e) => setMessage(e.target.value)} />
                                        </Form.Group>
                                        <Button className={'w-100'} type='submit' variant={'success'} disabled={isSendingBuyEmail}>
                                            {isSendingBuyEmail
                                                ? <Spinner variant={'info'} animation={'border'} />
                                                : <span>Send Inquiry</span>
                                            }
                                        </Button>
                                        {errorSendingBuyEmail
                                            ? <small className={'text-warning'}>{'Something went wrong sending your inquiry. Please try again.'}</small>
                                            : null}
                                    </Form>
                                </Modal.Body>
                            </Modal>
                            <MovingColorImage src={imageSrc} title={attributes.title} />
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
                                                <Stack
                                                    gap={2}
                                                    direction={'horizontal'}
                                                >
                                                    <PriceFormatter price={attributes.price} isSold={isSold} />
                                                    {!isSold
                                                        ? (
                                                            <Button
                                                                size={'sm'}
                                                                variant={'warning'}
                                                                onClick={() => {
                                                                    setMessage(`I'm interested in buying ${attributes.title}. . . .`);
                                                                    setShowBuyModal(true);
                                                                }}
                                                            >
                                                                {'Buy'}
                                                            </Button>
                                                        )
                                                        : null}
                                                </Stack>
                                            </Stack>
                                            <Stack
                                                onClick={() => {
                                                    mutate();
                                                    setIsLiked(!isLiked);
                                                }}
                                                className={'mt-1 me-1'}
                                                style={{ alignItems: 'end' }}
                                            >
                                                {isLiked
                                                    ? (
                                                        <Stack className={'ms-auto align-items-center'} style={{ color: likesHeartColor }}>
                                                            <BsHeartFill size={'20'} color={likesHeartColor} />
                                                            <div style={{ fontSize: '.75rem' }}>
                                                                {totalLikes}
                                                            </div>
                                                        </Stack>
                                                    ) : (
                                                        <Stack className={'ms-auto align-items-center'} style={{ color: likesHeartColor }}>
                                                            <BsHeart size={'20'} color={likesHeartColor} />
                                                            <div style={{ fontSize: '.75rem' }}>
                                                                {totalLikes}
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

const SentEmailToast: React.FC<ISentEmailToastParams> = ({ showSentEmailToast, setShowSentEmailToast }) => (
    <ToastContainer
        className="position-fixed pt-5"
        position="top-center"
        style={{ zIndex: 1 }}
    >
        <Toast
            bg={'success'}
            show={showSentEmailToast}
            onClose={() => setShowSentEmailToast(!showSentEmailToast)}
            autohide
        >
            <Toast.Header>
                <strong className="me-auto">Email Sent</strong>
            </Toast.Header>
            <Toast.Body>Woohoo, your inquiry was sent!</Toast.Body>
        </Toast>
    </ToastContainer>
);

export default Artwork;
