import * as React from "react"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Badge, Button, Form, Modal, Spinner, Stack, Toast, ToastContainer } from 'react-bootstrap';
import { ArtworkAttributes, IArtwork, iArtworkToFormData, IImage } from "../models/Artwork";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { IResponseType } from "./Artworks";
import ArtworkFormFields from "./ArtworkFormFields";
import { ToastsContext } from "./providers/ToastsProvider";

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
    artwork: IArtwork | null;
    show: boolean;
    onClose: () => void;
}

const ArtworkForm: React.FC<IArtworkFormProps> = ({ artwork: initialArtwork, show, onClose }) => {
    const { setResponseToasts } = useContext(ToastsContext);
    const defaultArtwork = useMemo(() => ({
        title: '',
        year: '',
        media: '',
        price: '',
        salePrice: '',
        width: '',
        height: '',
        grouping: [],
        isNFS: false,
        isHomePage: false,
        images: [],
        saleDate: null,
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        location: ''
    } as IArtwork), []);

    useEffect(() => {
        setCurrentAttributes(iArtworkToFormData(initialArtwork || defaultArtwork));
        setId(initialArtwork?._id);
    }, [initialArtwork, defaultArtwork]);

    const [currentAttributes, setCurrentAttributes] = useState<IArtworkFormData>(
        iArtworkToFormData(initialArtwork || defaultArtwork)
    );
    const [id, setId] = useState(initialArtwork?._id);
    const images = useMemo(() => initialArtwork?.images || [], [initialArtwork]);
    const imageSrc = useMemo(() => {
        if (currentAttributes.file) {
            return URL.createObjectURL(currentAttributes.file);
        }
        return images.length > 0 ? images[0].url : '';
    }, [images, currentAttributes.file]);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation<IArtworkDeleteFormResponse, AxiosError>({
        mutationFn: async () => {
            axios.defaults.headers.delete['Authorization'] = sessionStorage.getItem('artsite-token');
            return axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${id}`);
        },
        onSuccess: (data) => {
            setResponseToasts(prev => [...prev, {
                text: data.data.message,
                variant: 'success'
            }]);
            setCurrentAttributes(ArtworkAttributes.create());
            reset();
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
        },
        onError: (data) => {
            setResponseToasts(prev => [...prev, {
                text: `${data.code} - ${data.message}`,
                variant: 'danger'
            }]);
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
            setResponseToasts(prev => [...prev, {
                text: data.data.message,
                variant: 'success'
            }]);
            setId(data.data.artwork._id);
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
            onClose();
        },
        onError: (data: AxiosError<{ message?: string }>) => {
            setResponseToasts(prev => [...prev, {
                text: `${data.code} - ${data.response?.data?.message ?? data.message}`,
                variant: 'danger'
            }]);
        }
    });

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (id && window.confirm('Are you sure you want to delete this artwork?')) {
            deleteMutation.mutate();
        }
    }, [id, deleteMutation]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        mutate(currentAttributes);
    }, [currentAttributes, mutate]);

    if (!show) return null;

    return (
        <Form id="artwork-form" onSubmit={handleSubmit}>
            <Modal
                show={show}
                onHide={onClose}
                size="xl"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '95vw',
                    maxWidth: '1200px',
                    height: '95vh',
                    margin: 0,
                    maxHeight: 'none',
                }}
                contentClassName="h-100 d-flex flex-column"
                dialogClassName="m-0 w-100 h-100"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="d-flex align-items-center gap-3">
                            {imageSrc && (
                                <img
                                    src={imageSrc}
                                    alt={currentAttributes.title}
                                    className="rounded"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            )}
                            <h5 className="mb-0">{id ? 'Edit Artwork' : 'Add New Artwork'}</h5>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{
                    overflowY: 'auto',
                    padding: '20px',
                    flex: '1 1 auto'
                }}>
                    {isPending ? (
                        <Stack direction="vertical" gap={2} style={{ alignItems: 'center' }}>
                            <Spinner variant="info" animation="border" className="text-center" />
                            <h5>
                                <Badge bg="info">{'Saving artwork'}</Badge>
                            </h5>
                        </Stack>
                    ) : (
                        <ArtworkFormFields
                            currentAttributes={currentAttributes}
                            setCurrentAttributes={setCurrentAttributes}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #dee2e6' }}>
                    {id && (
                        <Button
                            variant="outline-danger"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="me-auto"
                        >
                            {deleteMutation.isPending ? (
                                <Spinner variant="light" size="sm" className="me-2" />
                            ) : null}
                            Delete Artwork
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        form="artwork-form"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Spinner variant="light" size="sm" className="me-2" />
                        ) : null}
                        {id ? 'Save Changes' : 'Add Artwork'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
};

export default ArtworkForm;
