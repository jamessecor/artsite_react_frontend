import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { IArtwork, Groupings, GroupingsLabelsOrder } from '../models/Artwork';
import axios, { all } from 'axios';

const useArtworks = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['artworks'],
        queryFn: () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/artworks`)
    });
    const allArtworks = useMemo(() => (!isLoading && data?.data ? data.data.results : []) as Array<IArtwork>, [data, isLoading]);

    const [artworks, setArtworks] = useState<Array<IArtwork>>([]);

    const allYears = useMemo(() => allArtworks?.length ? [...new Set(allArtworks.map((artwork) => artwork.year))].sort().reverse() : [], [allArtworks]);
    const allGroupings = useMemo(() => {
        const groupings = new Array<string>();
        if (allArtworks) {
            allArtworks.forEach((artwork) => {
                if (artwork.grouping && artwork.grouping.length > 0) groupings.push(...artwork.grouping);
            });
        }
        return [...new Set(groupings)].sort((a, b) => GroupingsLabelsOrder[a] - GroupingsLabelsOrder[b]);
    }, [allArtworks]);

    const hiddenGroupings = ['digital_edits'];

    const setEm = useCallback((year = '', grouping: Groupings = '', searchTerm = '', current = false) => {
        let newArtworks = allArtworks ?? [];
        if (year) {
            newArtworks = newArtworks
                .filter(x => !x.grouping?.length || x.grouping?.length === 0)
                .filter(x => x.year.toString() === year.toString());
        }
        if (grouping) {
            newArtworks = newArtworks.filter(x => x.grouping?.includes(grouping));
        }
        if (searchTerm) {
            newArtworks = newArtworks.filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase())
                || x.year.toLowerCase().includes(searchTerm.toLowerCase())
                || x.media.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (current) {
            newArtworks = newArtworks.filter(x => x.isHomePage);
        }
        newArtworks = newArtworks.sort((a, b) => {
            const aArrangement = a.arrangement || 1000;
            const bArrangement = b.arrangement || 1000;
            return aArrangement - bArrangement;
        });
        setArtworks(newArtworks);
    }, [allArtworks]);

    const randomArtwork = useCallback(() => {
        setEm();
        const filteredWorks = allArtworks.filter((artwork) => artwork.grouping && artwork.grouping.includes('merica'));
        return filteredWorks[Math.floor(Math.random() * filteredWorks.length)];
    }, [allArtworks, setEm]);

    const soldArtworkByQuarter = useCallback((startDate: Date, endDate: Date) => {
        setEm();
        const soldArtworks = allArtworks.filter((artwork) => artwork.saleDate && new Date(artwork.saleDate) >= startDate && new Date(artwork.saleDate) <= endDate);
        return soldArtworks;
    }, [allArtworks, setEm]);

    const likedArtworks = useMemo(() => allArtworks ? allArtworks.filter((artwork) => artwork.totalLikes ?? 0 > 0).sort((a, b) => (b.totalLikes ?? 0) - (a.totalLikes ?? 0)) : [], [allArtworks]);

    return {
        artworks,
        randomArtwork,
        allYears,
        allGroupings,
        hiddenGroupings,
        setArtworks,
        setEm,
        soldArtworkByQuarter,
        likedArtworks,
        isLoading
    };
};

export default useArtworks;