import * as React from "react"
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { Button, Col, Form, Modal, Spinner, Stack, Toast, ToastContainer } from 'react-bootstrap';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./providers/BackgroundColorProvider";
import { BsHeart as BsHeartIcon, BsHeartFill as BsHeartFillIcon } from "react-icons/bs";
const BsHeart = BsHeartIcon as React.ComponentType<any>;
const BsHeartFill = BsHeartFillIcon as React.ComponentType<any>;
import { getImageSrc, IArtwork, ILike } from "../models/Artwork";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsContext } from "./providers/SettingsProvider";

interface ArtworkParams {
    attributes: IArtwork;
};

interface ISentEmailToastParams {
    showSentEmailToast: boolean;
    setShowSentEmailToast: Dispatch<SetStateAction<boolean>>;
}

interface IArtworkPutLikeResponse {
    message: string;
    likes: Array<ILike>;
    totalLikes: number;
}

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

const Artwork: React.FC<ArtworkParams> = ({ attributes }: ArtworkParams) => {
    const { color } = useContext(BackgroundColorContext);
    const { isShowingInfo } = useContext(SettingsContext);
    const likes: Array<IArtwork> = useMemo(() => JSON.parse(sessionStorage.getItem(likesSessionName) ?? '[]') ?? [], []);
    const [isLiked, setIsLiked] = useState(likes.filter((like) => like._id === attributes._id).length > 0);
    const [totalLikes, setTotalLikes] = useState(attributes.totalLikes ?? 0);
    const amount = useMemo(() => isLiked ? -1 : 1, [isLiked]);
    const imageSrc = useMemo(() => getImageSrc(attributes.images), [attributes]);
    const isSold = useMemo(() => Boolean(attributes.saleDate ?? attributes.isNFS), [attributes]);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showSentEmailToast, setShowSentEmailToast] = useState(false);
    const queryClient = useQueryClient();
    useEffect(() => {
        if (isLiked) {
            sessionStorage.setItem(likesSessionName, JSON.stringify([...likes, attributes]));
        }
        else {
            sessionStorage.setItem(likesSessionName, JSON.stringify(likes.filter((like) => like._id !== attributes._id)));
        }
    }, [isLiked, likes, attributes]);
    const { mutate } = useMutation<IArtworkPutLikeResponse, AxiosError, void, unknown>({
        mutationFn: async () => {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${attributes._id}/likes`, {
                timestamp: new Date().toISOString(),
                amount: amount
            });
            return response.data;
        },
        onSuccess: (data) => {
            // update artwork
            setTotalLikes(data.totalLikes);
            queryClient.setQueryData(['artworks', { _id: attributes._id }], {
                ...attributes,
                totalLikes: data.totalLikes
            });
        },
        onError: (error: AxiosError) => {
            // hmm, set it back?
            setIsLiked(!isLiked);
        }
    });

    const { mutate: buyMutate, isPending: isSendingBuyEmail, error: errorSendingBuyEmail } = useMutation<IArtworkEmailPostResponse, AxiosError, IBuyEmailFormData, unknown>({
        mutationFn: async (formData: IBuyEmailFormData) => {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/email`, {
                email: formData.email,
                message: formData.message
            });
            return response.data;
        },
        onSuccess: (data) => {
            setShowBuyModal(false);
            setShowSentEmailToast(true);
        },
        onError: (error: AxiosError) => {
            console.error('Error sending email:', error);
        }
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        buyMutate({ email: email, message: message });
    }

    return (
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
                {isShowingInfo
                    ? (
                        <React.Fragment>
                            <Stack className={isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text' : 'light-text'}>
                                <div className='fw-bold'>{attributes.title}</div>
                                <div>{attributes.year}</div>
                                <div>{attributes.media}</div>
                                {attributes.width && attributes.height
                                    ? <div>{`${attributes.height}x${attributes.width}`}</div>
                                    : null}
                                <Stack
                                    gap={2}
                                    direction={'horizontal'}
                                >
                                    <PriceFormatter price={attributes.price} isSold={isSold} />
                                    {/* {!isSold
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
                                        : null} */}
                                </Stack>
                            </Stack>
                            {/* <Stack
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
                            </Stack> */}
                        </React.Fragment>
                    ) : null}
            </Stack>
        </Col>
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
