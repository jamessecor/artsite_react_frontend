import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { IArtwork, Groupings, GroupingsLabelsOrder } from '../models/Artwork';
import axios, { all, AxiosError } from 'axios';

interface IArtworkMetadataResponse {
    data: IArtworkMetadata;
}

interface IArtworkMetadata {
    groupings: Array<string>;
    years: Array<string>;
}
const useArtworksMetadata = () => {
    const { data: artworksMetaData, isLoading: isLoadingArtworksMetaData } = useQuery<IArtworkMetadataResponse, Error, IArtworkMetadata>({
        queryKey: ['artworks-meta-data'],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/meta-data`),
        select: (data) => ({
            groupings: data.data.groupings.filter((grouping) => !hiddenGroupings.includes(grouping)),
            years: data.data.years
        })
    });

    const hiddenGroupings = ['digital_edits'];

    // const likedArtworks = useMemo(() => allArtworks ? allArtworks.filter((artwork) => artwork.totalLikes ?? 0 > 0).sort((a, b) => (b.totalLikes ?? 0) - (a.totalLikes ?? 0)) : [], [allArtworks]);

    return {
        artworksMetaData,
        isLoadingArtworksMetaData,
        hiddenGroupings,
    };
};

export default useArtworksMetadata;