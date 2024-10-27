import { useQuery } from '@tanstack/react-query';
import { IArtwork } from '../models/Artwork';
import axios from 'axios';

interface ISoldArtworksQuery {
    startDate: Date;
    endDate: Date;
}

interface IArtworkResponse {
    data: Array<IArtwork>;
}

const useSoldArtworks = ({ startDate, endDate }: ISoldArtworksQuery) => {
    const searchParams = new URLSearchParams();
    if (startDate) searchParams.set('start', startDate.toISOString());
    if (endDate) searchParams.set('end', endDate.toISOString());

    const soldArtworksQuery = useQuery<IArtworkResponse, Error, Array<IArtwork>>({
        queryKey: ['artworks', startDate, endDate],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/sold?${searchParams.toString()}`),
        select: (responseData) => responseData.data
    });

    return {
        soldArtworksQuery,
    };
};

export default useSoldArtworks;