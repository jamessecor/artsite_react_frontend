import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { IArtwork, Groupings, GroupingsLabelsOrder } from '../models/Artwork';
import axios, { all } from 'axios';

interface IArtworksQuery {
    year?: string;
    grouping?: string;
    search?: string;
    isHomePage?: string;
}

interface IArtworkResponse {
    data: Array<IArtwork>;
}

const useArtworks = ({ year, grouping, isHomePage, search }: IArtworksQuery) => {
    const searchParams = new URLSearchParams();
    if (year) searchParams.set('year', year);
    if (grouping) searchParams.set('grouping', grouping);
    if (isHomePage) searchParams.set('isHomePage', isHomePage);
    if (search) searchParams.set('search', search);

    const { data: artworks, isLoading: isLoadingArtworks } = useQuery<IArtworkResponse, Error, Array<IArtwork>>({
        queryKey: ['artworks', year, grouping, search],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/artworks?${searchParams.toString()}`),
        select: (responseData) => responseData.data
    });

    // const likedArtworks = useMemo(() => allArtworks ? allArtworks.filter((artwork) => artwork.totalLikes ?? 0 > 0).sort((a, b) => (b.totalLikes ?? 0) - (a.totalLikes ?? 0)) : [], [allArtworks]);

    return {
        artworks,
        isLoadingArtworks,
        // likedArtworks,
    };
};

export default useArtworks;