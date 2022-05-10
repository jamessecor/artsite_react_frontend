import { useCallback } from 'react';
import config from '../config.json';

const useFetchArtworks = (filter, searchTerm = '') => {
    const fetchArtworks = useCallback(() => {
        let params = [];
        if (searchTerm !== '') {
            params.push(`search=${searchTerm}`);
        } else {
            if (filter !== undefined) {
                params.push(`year_filter=${filter}`);
            }
        }
        fetch(`${config.host}api/artworks?${params.join('&')}`,
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                method: "GET"
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.length !== 0) {
                        return result;
                    }
                }
            )
    }, [searchTerm, filter]);

    return fetchArtworks(filter, searchTerm);
};

export default useFetchArtworks;