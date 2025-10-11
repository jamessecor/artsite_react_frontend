import * as React from "react"
import { useCallback, useEffect, useContext, useMemo, useState } from "react"
import { Button, Col, Form, Spinner, Stack } from 'react-bootstrap';
import { BackgroundColorContext, textColor } from "./providers/BackgroundColorProvider";
import { ArtworkAttributes, getImageSrc, Groupings, IArtwork, iArtworkToFormData, IImage } from "../models/Artwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { GiElephant as GiElephantIcon } from "react-icons/gi";
const GiElephant = GiElephantIcon as React.ComponentType<any>;
import { MdLandscape as MdLandscapeIcon } from "react-icons/md";
const MdLandscape = MdLandscapeIcon as React.ComponentType<any>;
import { IResponseType } from "./Artworks";
import useArtworksMetadata from "../hooks/useArtworksMetadata";

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
    onResponse: (response: IResponseType) => void;
}

const ArtworkForm: React.FC<IArtworkFormProps> = ({ attributes, isInFormMode, isInArrangementMode, onResponse }) => {
    const { color } = useContext(BackgroundColorContext);
    const [isShowingForm, setIsShowingForm] = useState(isInFormMode);
    const [currentAttributes, setCurrentAttributes] = useState<IArtworkFormData>(iArtworkToFormData(attributes));
    const [id, setId] = useState(attributes._id);
    const [newImages, setNewImages] = useState<Array<IImage> | null>(null);
    const images = useMemo(() => newImages ?? attributes.images, [newImages, attributes.images]);
    const imageSrc = useMemo(() => getImageSrc(images), [images]);

    useEffect(() => setIsShowingForm(isInFormMode), [isInFormMode]);

    const queryClient = useQueryClient();
    const { data: artworksMetaData, isLoading: isLoadingArtworksMetaData } = useArtworksMetadata();

    const deleteMutation = useMutation<IArtworkDeleteFormResponse, AxiosError>({
        mutationFn: async () => {
            axios.defaults.headers.delete['Authorization'] = sessionStorage.getItem('artsite-token');
            return axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${id}`);
        },
        onSuccess: (data) => {
            if (onResponse) {
                onResponse({
                    text: data.data.message,
                    variant: 'success'
                });
            }
            setCurrentAttributes(ArtworkAttributes.create());
            reset();
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
        },
        onError: (data) => {
            if (onResponse) {
                onResponse({
                    text: `${data.code} - ${data.message}`,
                    variant: 'danger'
                });
            }
        }
    });

    const { reset, isSuccess, isPending, mutate } = useMutation<IArtworkFormResponse, AxiosError, IArtworkFormData>({
        mutationFn: async (formData: IArtworkFormData) => {
            axios.defaults.headers.put['Authorization'] = sessionStorage.getItem('artsite-token');
            axios.defaults.headers.post['Authorization'] = sessionStorage.getItem('artsite-token');
            axios.defaults.headers.put['Accept'] = 'multipart/form-data';
            axios.defaults.headers.post['Accept'] = 'multipart/form-data';
            axios.defaults.headers.put['Content-Type'] = 'multipart/form-data';
            axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

            return id
                ? axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${id}`, formData)
                : axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/artworks`, formData);
        },
        onSuccess: (data) => {
            if (onResponse) {
                onResponse({
                    text: data.data.message,
                    variant: 'success'
                });
            }
            setId(data.data.artwork._id);
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
        },
        onError: (data: AxiosError<{ message?: string }>) => {
            if (onResponse) {
                onResponse({
                    text: `${data.code} - ${data.response?.data?.message ?? data.message}`,
                    variant: 'danger'
                });
            }
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
        <Col xs={12}>
            <Stack className={`${textColor(color.r, color.g, color.b)} bg-dark rounded p-2`}>
                <div style={{ position: 'relative' }}>
                    <img
                        alt={currentAttributes.title}
                        src={imageSrc}
                        width={'100%'}
                        onClick={() => setIsShowingForm(!isShowingForm)}
                    />
                    <div style={{ top: 0, right: 0, position: 'absolute', display: 'd-flex flex-row' }}>
                        {images.map((image) => (
                            <Button
                                onClick={() => window.open(image.url)}
                                variant={'dark'}
                                key={image.size}
                                className={'m-1'}
                            >
                                {image.size === 1 ? <GiElephant /> : <MdLandscape />}
                                <span className={'ms-1'} >
                                    {image.size === 1 ? '' : image.size}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
                {
                    isShowingForm
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
                                            <Form.Group className="mb-3" controlId="salePrice">
                                                <Form.Label>sale price (including tax)</Form.Label>
                                                <Form.Control
                                                    onChange={(e) => setCurrentAttributes({
                                                        ...currentAttributes,
                                                        salePrice: e.target.value
                                                    })}
                                                    value={currentAttributes.salePrice}
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
                                                <Form.Label className={'text-break'}>
                                                    {isLoadingArtworksMetaData
                                                        ? 'tags'
                                                        : artworksMetaData?.groupings}
                                                </Form.Label>
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
                                                        saleDate: e.target.value === '' ? null : new Date(e.target.value)
                                                    })}
                                                    value={currentAttributes.saleDate ? new Date(currentAttributes.saleDate).toISOString()?.substring(0, 10) : ''}
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
                                        <Button disabled={isPending} className={'w-100'} type={'submit'}>
                                            {isPending
                                                ? <Spinner variant={'info'} animation={'border'} className={'text-center'} />
                                                : (id ? 'Update' : 'Add New Artwork')
                                            }
                                        </Button>
                                    )
                                }
                            </Form>
                        )
                        : null
                }
                {
                    id && isInArrangementMode && isShowingForm
                        ? (
                            <Form onSubmit={handleDelete}>
                                <Button disabled={deleteMutation.isPending} className={'w-100 mt-2'} type={'submit'} variant={'danger'}>
                                    {deleteMutation.isPending
                                        ? <Spinner variant={'info'} animation={'border'} className={'text-center'} />
                                        : 'Delete'
                                    }
                                </Button>
                            </Form>
                        )
                        : null
                }
            </Stack >
        </Col >
    );
};

export default ArtworkForm;
