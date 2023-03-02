import * as React from "react"
import { useCallback, useState } from "react"
import MovingColorImage from "./MovingColorImage";
import { Button, Col, Form, Spinner, Stack, Toast, ToastContainer } from 'react-bootstrap';
import { BackgroundColorContext, isTooLightForDarkTheme, textColor } from "./providers/BackgroundColorProvider";
import { ArtworkAttributes, Groupings, GroupingsLabels, IArtwork } from "../models/Artwork";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Variant } from "react-bootstrap/esm/types";

interface IArtworkFormData extends IArtwork {
    file?: File;
}

interface IArtworkFormResponse {
    data: {
        message: string;
        image: string;
        _id: string;
    }
}

interface IArtworkDeleteFormResponse {
    data: {
        message: string;
    }
}

interface IArtworkFormProps {
    attributes: IArtwork;
}

interface IResponseType {
    text?: string;
    variant?: Variant;
}

const ArtworkForm: React.FC<IArtworkFormProps> = ({ attributes }) => {
    const [currentAttributes, setCurrentAttributes] = useState<IArtworkFormData>(attributes);
    const [responseToast, setResponseToast] = useState<IResponseType>({});

    const deleteMutation = useMutation<IArtworkDeleteFormResponse, AxiosError>(_ => {
        axios.defaults.headers.delete['Authorization'] = sessionStorage.getItem('artsite-token');
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/artworks/${currentAttributes._id}`);
    }, {
        onSuccess: (data) => {
            setResponseToast({
                text: data.data.message,
                variant: 'success'
            });
            setCurrentAttributes(ArtworkAttributes.create());
            reset();
        },
        onError: (data) => {
            setResponseToast({
                text: `${data.code} - ${data.message}`,
                variant: 'danger'
            })
        }
    });

    const { reset, isSuccess, isLoading, mutate } = useMutation<IArtworkFormResponse, AxiosError, IArtworkFormData>(formData => {
        axios.defaults.headers.put['Authorization'] = sessionStorage.getItem('artsite-token');
        axios.defaults.headers.post['Authorization'] = sessionStorage.getItem('artsite-token');
        axios.defaults.headers.put['Accept'] = 'multipart/form-data';
        axios.defaults.headers.post['Accept'] = 'multipart/form-data';
        axios.defaults.headers.put['Content-Type'] = 'multipart/form-data';
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

        return currentAttributes._id
            ? axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/artworks/${currentAttributes._id}`, formData)
            : axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/artworks`, formData);
    }, {
        onSuccess: (data) => {
            setResponseToast({
                text: data.data.message,
                variant: 'success'
            });
            setCurrentAttributes({
                ...currentAttributes,
                image: data.data.image,
                _id: data.data._id
            });
        },
        onError: (data) => {
            setResponseToast({
                text: `${data.code} - ${data.message}`,
                variant: 'danger'
            })
        }
    });

    const handleDelete = useCallback((e) => {
        e.preventDefault();
        if (currentAttributes._id) {
            if (window.confirm('DELETE?!')) {
                deleteMutation.mutate();
            }
        }
    }, [currentAttributes._id]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const attributesToSubmit = {
            ...currentAttributes,
            _id: undefined
        }
        mutate(attributesToSubmit);
    }, [currentAttributes]);

    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                <Col xs='12'>
                    {responseToast.text && (
                        <Toast
                            onClose={() => setResponseToast({})}
                            style={{ zIndex: 1000 }}
                            className={'mb-2 me-2 position-fixed bottom-0 end-0'}
                            autohide
                            delay={3000}
                            bg={responseToast.variant ?? ''}
                        >
                            <Toast.Header>
                                <strong className='me-auto'>
                                    {'Update Message'}
                                </strong>
                            </Toast.Header>
                            <Toast.Body>
                                {responseToast.text}
                            </Toast.Body>
                        </Toast>
                    )}
                    <Stack className={`${textColor(color.r, color.g, color.b)} bg-dark rounded p-2`}>
                        <Form onSubmit={handleSubmit}>
                            <MovingColorImage src={currentAttributes.image} title={currentAttributes.title} />
                            <Form.Group className="mb-3" controlId="image">
                                <Form.Label>file</Form.Label>
                                <input type={'file'} onChange={(e) => e.target?.files?.length ? setCurrentAttributes({...currentAttributes, file: e.target.files[0]}) : null} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>title</Form.Label>
                                <Form.Control
                                    onChange={(e) => setCurrentAttributes({
                                        ...currentAttributes,
                                        title: e.target.value
                                    })}
                                    value={currentAttributes.title}
                                    type="text"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="year">
                                <Form.Label>year</Form.Label>
                                <Form.Control
                                    onChange={(e) => setCurrentAttributes({
                                        ...currentAttributes,
                                        year: e.target.value
                                    })}
                                    value={currentAttributes.year}
                                    type="text"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="media">
                                <Form.Label>media</Form.Label>
                                <Form.Control
                                    onChange={(e) => setCurrentAttributes({
                                        ...currentAttributes,
                                        media: e.target.value
                                    })}
                                    value={currentAttributes.media}
                                    type="text"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="price">
                                <Form.Label>price</Form.Label>
                                <Form.Control
                                    onChange={(e) => setCurrentAttributes({
                                        ...currentAttributes,
                                        price: e.target.value
                                    })}
                                    value={currentAttributes.price}
                                    type="text"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="grouping">
                                <Form.Label className={'text-break'}>{`${Object.keys(GroupingsLabels)}`}</Form.Label>
                                <Form.Control
                                    onChange={(e) => setCurrentAttributes({
                                        ...currentAttributes,
                                        grouping: e.target.value.split(',') as Array<Groupings>
                                    })}
                                    value={currentAttributes.grouping}
                                    type="text"
                                />
                            </Form.Group>
                            {isSuccess
                                ? (
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            reset();
                                        }}
                                        variant={'success'}
                                        className={'w-100'}
                                    >
                                        {'Re-Edit'}
                                    </Button>
                                )
                                : (
                                    <Button disabled={isLoading} className={'w-100'} type={'submit'}>
                                        {isLoading
                                            ? <Spinner variant={'info'} animation={'border'} className={'text-center'} />
                                            : (currentAttributes._id ? 'Update' : 'Add New Artwork')
                                        }
                                    </Button>
                                )
                            }
                        </Form>
                        {currentAttributes._id
                            ? (
                                <Form onSubmit={handleDelete}>
                                    <Button disabled={deleteMutation.isLoading} className={'w-100 mt-2'} type={'submit'} variant={'danger'}>
                                        {deleteMutation.isLoading
                                            ? <Spinner variant={'info'} animation={'border'} className={'text-center'} />
                                            : 'Delete'
                                        }
                                    </Button>
                                </Form>
                            )
                            : null}
                    </Stack>
                </Col>
            )}
        </BackgroundColorContext.Consumer>
    );
}

export default ArtworkForm;