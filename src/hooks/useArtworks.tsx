import { useCallback, useMemo, useState } from 'react';
import { artworks2012 } from '../data/artworks/2012/artworks';
import { artworks2013 } from '../data/artworks/2013/artworks';
import { artworks2014 } from '../data/artworks/2014/artworks';
import { artworks2015 } from '../data/artworks/2015/artworks';
import { artworks2016 } from '../data/artworks/2016/artworks';
import { artworks2017 } from '../data/artworks/2017/artworks';
import { artworks2018 } from '../data/artworks/2018/artworks';
import { artworks2019 } from '../data/artworks/2019/artworks';
import { artworks2020 } from '../data/artworks/2020/artworks';
import { artworks2021 } from '../data/artworks/2021/artworks';
import { artworks2022 } from '../data/artworks/2022/artworks';
import { Artwork } from '../models/Artwork';

interface UseArtworkParams {
    year: string;
    grouping: string;
    searchTerm: string;
}

const groupingsLabels = {
    "nomophobia": "#nomophobia",
    "digital_edits": "digital_edits",
    "storage": "as not seen",
    "mug_dish_glass": "animal mug, dish, and glass",
    "merica": "Freedom Fries",
    "wallabies": "Off the Wallabies"
};

const useArtworks = (year = '', grouping = '', searchTerm = '') => {
    const [artworks, setArtworks] = useState<Array<Artwork>>([]);
    
    const allArtworks: Array<Artwork> = useMemo(() => [
        ...artworks2012,
        ...artworks2013,
        ...artworks2014,
        ...artworks2015,
        ...artworks2016,
        ...artworks2017,
        ...artworks2018,
        ...artworks2019,
        ...artworks2020,
        ...artworks2021,
        ...artworks2022
    ], [artworks2012,
        artworks2013,
        artworks2014,
        artworks2015,
        artworks2016,
        artworks2017,
        artworks2018,
        artworks2019,
        artworks2020,
        artworks2021,
        artworks2022]);

    const allYears = useMemo(() => [...new Set(allArtworks.map((artwork) => artwork.year))].sort().reverse(), [allArtworks]);
    const allGroupings = useMemo(() => {
        const groupings = new Array<string>;
        allArtworks.filter((artwork) => artwork.grouping && artwork.grouping.length > 0).map((artwork) => groupings.push(...artwork.grouping));
        return [...new Set(groupings)];
    }, [allArtworks]);
    
    const setEm = useCallback((year = '', grouping = '', searchTerm = '') => {
        let newArtworks = allArtworks;
        if (year) {
            newArtworks = newArtworks.filter(x => x.year.toString() === year.toString());
        }
        if (grouping) {
            newArtworks = newArtworks.filter(x => x.grouping?.includes(grouping));
        }
        if (searchTerm) {
            newArtworks = newArtworks.filter(x => x.title.toString().toLowerCase().includes(searchTerm.toString().toLowerCase()));
        }
        newArtworks = newArtworks.sort((a, b) => a.arrangement.localeCompare(b.arrangement));
        setArtworks(newArtworks);
    }, [allArtworks]);

    const randomArtwork = useCallback(() => {
        setEm();
        const filteredWorks = allArtworks.filter((artwork) => artwork.grouping && artwork.grouping.includes('merica'));
        return filteredWorks[Math.floor(Math.random() * filteredWorks.length)];
    }, [allArtworks, setEm]);

    return {
        artworks,
        randomArtwork,
        allYears,
        allGroupings,
        groupingsLabels,
        setArtworks,
        setEm
    };
};

export default useArtworks;