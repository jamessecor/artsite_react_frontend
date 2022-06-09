import { useCallback, useState } from 'react';
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

const useArtworks = (year, searchTerm = '') => {
    const [artworks, setArtworks] = useState([]);

    const allArtworks = [
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
    ];

    const setEm = useCallback((year, searchTerm) => {
        let newArtworks = allArtworks;
        if (year) {
            newArtworks = newArtworks.filter(x => x.year.toString() === year.toString());
        }
        setArtworks(newArtworks);
    }, [year, searchTerm]);

    return {
        artworks,
        setArtworks,
        setEm
    };
};

export default useArtworks;