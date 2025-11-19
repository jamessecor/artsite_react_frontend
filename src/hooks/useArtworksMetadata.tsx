import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface IArtworkMetadataResponse {
    data: IArtworkMetadata;
}

interface IArtworkMetadata {
    groupings: Array<string>;
    years: Array<string>;
}
const hiddenGroupings = ['digital_edits'];

const useArtworksMetadata = () => useQuery<IArtworkMetadataResponse, Error, IArtworkMetadata>({
    queryKey: ['artworks', 'meta-data'],
    queryFn: () => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/meta-data`),
    select: (data) => ({
        groupings: data.data.groupings.filter((grouping) => !hiddenGroupings.includes(grouping)),
        years: data.data.years
    }),
    refetchOnMount: false
});

export default useArtworksMetadata;