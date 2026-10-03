import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Alert, Spinner, Stack } from 'react-bootstrap';

interface BulkEditArtworksFormProps {
    ids: string[];
    onSuccess?: () => void;
    onClose?: () => void;
}

interface BulkEditPayload {
    ids: string[];
    width: string | null;
    height: string | null;
    location: string | null;
    price: string | null;
}

const bulkEditArtworks = async (payload: BulkEditPayload) => {
    axios.defaults.headers.post['Authorization'] = sessionStorage.getItem('artsite-token');
    axios.defaults.headers.post['Accept'] = 'application/json';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/bulk-edit`, payload);
    return data;
};

export default function BulkEditArtworksForm({ ids, onSuccess, onClose }: BulkEditArtworksFormProps) {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: bulkEditArtworks,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['artworks']
            });
            onSuccess?.();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutation.mutate({
            ids: ids,
            width: width.trim() !== '' ? width : null,
            height: height.trim() !== '' ? height : null,
            location: location.trim() !== '' ? location : null,
            price: price.trim() !== '' ? price : null,
        });
    };

    const hasAnyValue = [width, height, location, price].some((v) => v.trim() !== '');

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Stack gap={3}>
                {mutation.isError && (
                    <Alert variant="danger" className="mb-0">
                        {(mutation.error as any)?.response?.data?.message ?? 'Something went wrong. Please try again.'}
                    </Alert>
                )}

                {mutation.isSuccess && (
                    <Alert variant="success" className="mb-0">
                        {ids.length} artwork{ids.length === 1 ? '' : 's'} updated successfully.
                    </Alert>
                )}

                <Form.Group className="width mb-3" controlId="width">
                    <Form.Label>Width</Form.Label>
                    <Form.Control
                        name="width"
                        type="text"
                        className="width"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        disabled={mutation.isPending}
                    />
                </Form.Group>

                <Form.Group className="height mb-3" controlId="height">
                    <Form.Label>Height</Form.Label>
                    <Form.Control
                        name="height"
                        type="text"
                        className="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        disabled={mutation.isPending}
                    />
                </Form.Group>

                <Form.Group className="location mb-3" controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        name="location"
                        type="text"
                        className="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={mutation.isPending}
                    />
                </Form.Group>

                <Form.Group className="price mb-3" controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        name="price"
                        type="text"
                        className="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={mutation.isPending}
                    />
                </Form.Group>

                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    {onClose && (
                        <Button variant="secondary" onClick={onClose} disabled={mutation.isPending}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" variant="primary" disabled={mutation.isPending || !hasAnyValue}>
                        {mutation.isPending && (
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                        )}
                        {mutation.isPending ? 'Saving...' : 'Save changes'}
                    </Button>
                </Stack>
            </Stack>
        </Form>
    );
}
