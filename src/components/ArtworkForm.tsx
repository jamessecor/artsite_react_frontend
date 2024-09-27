import * as React from "react"
import { useCallback, useEffect, useContext, useMemo, useState } from "react"
import { Button, Col, Form, Spinner, Stack, Toast } from 'react-bootstrap';
import { BackgroundColorContext, textColor } from "./providers/BackgroundColorProvider";
import { ArtworkAttributes, getImageSrc, Groupings, IArtwork, iArtworkToFormData, IImages } from "../models/Artwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Variant } from "react-bootstrap/esm/types";
import useArtworks from "../hooks/useArtworks";
import { GiElephant } from "react-icons/gi";
import { MdLandscape } from "react-icons/md";

export interface IArtworkFormData extends Omit<IArtwork, '_id' | 'images'> {
    file?: File;
}

interface IArtworkFormResponse {
    data: {
        message: string;
        artwork: IArtwork;
    }
}

interface IArtworkDeleteFormResponse {
    data: {
        message: string;
    }
}

interface IArtworkFormProps {
    attributes: IArtwork;
    isInArrangementMode?: boolean;
    isInFormMode: boolean;
}

interface IResponseType {
    text?: string;
    variant?: Variant;
}

const ArtworkForm: React.FC<IArtworkFormProps> = ({ attributes, isInFormMode, isInArrangementMode }) => {
    const { color } = useContext(BackgroundColorContext);
    const [isShowingForm, setIsShowingForm] = useState(isInFormMode);
    const [responseToast, setResponseToast] = useState<IResponseType>({});
    const [currentAttributes, setCurrentAttributes] = useState<IArtworkFormData>(iArtworkToFormData(attributes));
    const [id, setId] = useState(attributes._id);
    const [newImages, setNewImages] = useState<IImages | null>(null);
    const images = useMemo(() => newImages ?? attributes.images, [newImages, attributes.images]);
    const imageSrc = useMemo(() => getImageSrc(images), [images]);
    console.log('id', currentAttributes.title, id);

    useEffect(() => setIsShowingForm(isInFormMode), [isInFormMode]);

    const queryClient = useQueryClient();
    const { allGroupings } = useArtworks();

    const deleteMutation = useMutation<IArtworkDeleteFormResponse, AxiosError>(_ => {
        axios.defaults.headers.delete['Authorization'] = sessionStorage.getItem('artsite-token');
        return axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${id}`);
    }, {
        onSuccess: (data) => {
            setResponseToast({
                text: data.data.message,
                variant: 'success'
            });
            setCurrentAttributes(ArtworkAttributes.create());
            reset();
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
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

        return id
            ? axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${id}`, formData)
            : axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/artworks`, formData);
    }, {
        onSuccess: (data) => {
            setResponseToast({
                text: data.data.message,
                variant: 'success'
            });
            setId(data.data.artwork._id);
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
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
        if (id) {
            if (window.confirm('DELETE?!')) {
                deleteMutation.mutate();
            }
        }
    }, [id, deleteMutation]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        mutate(currentAttributes);
    }, [currentAttributes, mutate]);

    return (

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
                <div style={{ position: 'relative' }}>
                    <img
                        alt={currentAttributes.title}
                        src={imageSrc}
                        width={'100%'}
                        onClick={() => setIsShowingForm(!isShowingForm)}
                    />
                    <div style={{ top: 0, right: 0, position: 'absolute', display: 'd-flex flex-row' }}>
                        {Object.entries(images).map((image) => (
                            <Button
                                onClick={() => window.open(image[1])}
                                variant={'dark'}
                                key={image[0]}
                                className={'m-1'}
                            >
                                {parseInt(image[0]) === 1 ? <GiElephant /> : <MdLandscape />}
                                <span className={'ms-1'} >
                                    {parseInt(image[0]) === 1 ? '' : image[0]}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
                {isShowingForm
                    ? (
                        <Form onSubmit={handleSubmit}>
                            {isInArrangementMode
                                ? (

                                    <React.Fragment>
                                        <Form.Group className="mb-3" controlId="image">
                                            <Form.Label>file</Form.Label>
                                            <input type={'file'} onChange={(e) => e.target?.files?.length ? setCurrentAttributes({ ...currentAttributes, file: e.target.files[0] }) : null} />
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
                                        <Form.Group className="mb-3" controlId="width">
                                            <Form.Label>{'width'}</Form.Label>
                                            <Form.Control
                                                onChange={(e) => setCurrentAttributes({
                                                    ...currentAttributes,
                                                    width: e.target.value
                                                })}
                                                value={currentAttributes.width}
                                                type="text"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="height">
                                            <Form.Label>{'height'}</Form.Label>
                                            <Form.Control
                                                onChange={(e) => setCurrentAttributes({
                                                    ...currentAttributes,
                                                    height: e.target.value
                                                })}
                                                value={currentAttributes.height}
                                                type="text"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="grouping">
                                            <Form.Label className={'text-break'}>{allGroupings.length ? allGroupings.toString() : 'tags'}</Form.Label>
                                            <Form.Control
                                                onChange={(e) => setCurrentAttributes({
                                                    ...currentAttributes,
                                                    grouping: e.target.value.split(',') as Array<Groupings>
                                                })}
                                                value={currentAttributes.grouping}
                                                type="text"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="saleDate">
                                            <Form.Label>{'Sale Date'}</Form.Label>
                                            <Form.Control
                                                onChange={(e) => setCurrentAttributes({
                                                    ...currentAttributes,
                                                    saleDate: e.target.value
                                                })}
                                                value={currentAttributes.saleDate}
                                                type="date"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="isNFS">
                                            <Form.Check
                                                label={'NFS'}
                                                onChange={(e) => setCurrentAttributes({
                                                    ...currentAttributes,
                                                    isNFS: !currentAttributes.isNFS
                                                })}
                                                checked={currentAttributes.isNFS}
                                                type="switch"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="isHomePage">
                                            <Form.Check
                                                label={'Home Page'}
                                                onChange={(e) => setCurrentAttributes({
                                                    ...currentAttributes,
                                                    isHomePage: !currentAttributes.isHomePage
                                                })}
                                                checked={currentAttributes.isHomePage}
                                                type="switch"
                                            />
                                        </Form.Group>
                                    </React.Fragment>
                                )
                                : null}
                            <Form.Group className="mb-3" controlId="arrangement">
                                <Form.Label>{'Arrangement'}</Form.Label>
                                <Form.Control
                                    onChange={(e) => setCurrentAttributes({
                                        ...currentAttributes,
                                        arrangement: parseInt(e.target.value)
                                    })}
                                    value={currentAttributes.arrangement}
                                    type="number"
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
                                            : (id ? 'Update' : 'Add New Artwork')
                                        }
                                    </Button>
                                )
                            }
                        </Form>
                    )
                    : null}
                {id && isInArrangementMode && isShowingForm
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
    );
};

export default ArtworkForm;
