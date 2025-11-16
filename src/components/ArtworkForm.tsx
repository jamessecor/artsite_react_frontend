import * as React from "react"
import { useCallback, useEffect, useContext, useMemo, useState } from "react"
import { Button, Col, Form, Modal, Spinner, Stack } from 'react-bootstrap';
import { BackgroundColorContext, textColor } from "./providers/BackgroundColorProvider";
import { ArtworkAttributes, getImageSrc, Groupings, IArtwork, iArtworkToFormData, IImage } from "../models/Artwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { GiElephant as GiElephantIcon } from "react-icons/gi";
const GiElephant = GiElephantIcon as React.ComponentType<any>;
import { MdLandscape as MdLandscapeIcon } from "react-icons/md";
const MdLandscape = MdLandscapeIcon as React.ComponentType<any>;
import { IResponseType } from "./Artworks";
import ArtworkFormFields from "./ArtworkFormFields";

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
    onResponse: (response: IResponseType) => void;
}

const ArtworkForm: React.FC<IArtworkFormProps> = ({ attributes, onResponse }) => {
    const { color } = useContext(BackgroundColorContext);
    const [showModal, setShowModal] = useState(false);
    const [currentAttributes, setCurrentAttributes] = useState<IArtworkFormData>(iArtworkToFormData(attributes));
    const [id, setId] = useState(attributes._id);
    const [newImages, setNewImages] = useState<Array<IImage> | null>(null);
    const images = useMemo(() => newImages ?? attributes.images, [newImages, attributes.images]);
    const imageSrc = useMemo(() => getImageSrc(images), [images]);

    const queryClient = useQueryClient();

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
                        onClick={() => setShowModal(true)}
                        style={{ cursor: 'pointer' }}
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
                <Modal className="w-100" show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{id ? 'Edit Artwork' : 'Add New Artwork'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <ArtworkFormFields
                                currentAttributes={currentAttributes}
                                setCurrentAttributes={setCurrentAttributes}
                                isPending={isPending}
                                id={id}
                            />
                            {id && (
                                <Button
                                    variant="danger"
                                    className="w-100 mt-3"
                                    onClick={handleDelete}
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? (
                                        <Spinner variant="light" size="sm" />
                                    ) : 'Delete'}
                                </Button>
                            )}
                        </Form>
                    </Modal.Body>
                </Modal>
            </Stack>
        </Col>
    );
};

export default ArtworkForm;
