import { Button, Stack, Table } from 'react-bootstrap';
import { IArtwork } from '../models/Artwork';
import './Inventory.css';
import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Inventory: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const ids = searchParams.getAll('ids');

    const { data: artworks = [], isLoading, error } = useQuery<Array<IArtwork>>({
        queryKey: ['artworks', 'inventory'],
        queryFn: async () => {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/artworks`);
            return data;
        }
    });

    const filteredArtworks = useMemo(() => ids.map((id) => {
        const a = artworks.find((artwork) => artwork._id === id);
        if (a) {
            return a;
        }
    }).filter((a) => a), [artworks]);

    return (
        <Stack
            direction={'vertical'}
            className={'inventory'}
        >
            <div>{'Inventory'}</div>
            <Table>
                <thead>
                    <tr>
                        <td></td>
                        <td>title</td>
                        <td>year</td>
                        <td>media</td>
                        <td>price</td>
                        <td>width</td>
                        <td>height</td>
                    </tr>
                </thead>
                <tbody>
                    {filteredArtworks.map((artwork) => (
                        <tr>
                            <td><img src={artwork.images[0].url} alt="" style={{ width: '50px', maxHeight: '50px', objectFit: 'contain' }} /></td>
                            <td>{artwork.title}</td>
                            <td>{artwork.year}</td>
                            <td>{artwork.media}</td>
                            <td>${artwork.price}</td>
                            <td>{artwork.width}</td>
                            <td>{artwork.height}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Stack>
    );
};

export default Inventory;