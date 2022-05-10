import React from 'react'
import { useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Artwork from "./Artwork";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faToggleOn, faToggleOff, faInfoCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import useIsRotating from './hooks/useIsRotating';
import useIsShowingInfo from './hooks/useIsShowingInfo';
import useFetchArtworks from './hooks/useFetchArtworks';
import config from './config.json';

const Artworks = ({ searchTerm }) => {
    const { isRotating, setIsRotating } = useIsRotating();
    const { isShowingInfo, setIsShowingInfo } = useIsShowingInfo();
    const { pathname } = useLocation();
    const year = pathname.substring(pathname.lastIndexOf('/') + 1) ?? '';

    const fetchArtworks = useCallback(() => {        
        let params = [];
        if (searchTerm !== '') {
            params.push(`search=${searchTerm}`);
        } else {
            if (year !== '') {
                params.push(`year_filter=${year}`);
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
    }, [year, searchTerm]);

    const artworks = useMemo(() => fetchArtworks(searchTerm), [year, searchTerm]);

    return (
        <React.Fragment>
            <span onClick={() => setIsRotating(!isRotating)}>
                <FontAwesomeIcon className={'ms-3'} icon={isRotating ? faToggleOn : faToggleOff}/>
                {/*<FontAwesomeIcon icon={this.state.isRotating ? faTeeth : faTeethOpen}/>*/}
                <span className="ms-1">{isRotating ? "normal, please" : "rainbow time!"}</span>
            </span>
            <span className="ps-3" onClick={() => setIsShowingInfo(!isShowingInfo)}>
                <FontAwesomeIcon icon={isShowingInfo ? faTimesCircle : faInfoCircle}/>
                <span className="ms-1">{isShowingInfo ? "hide info" : "show all info"}</span>
            </span>
            <div className="row align-items-center">
                {artworks ? 
                    (artworks.map((artwork, i) => {
                        return (
                            <div key={artwork.id} className="col-lg-4 col-12 mb-4">
                                <div key={artwork.id}>
                                    <Artwork isShowingInfo={isShowingInfo} isRotating={isRotating}
                                                key={artwork.id} attributes={artwork} isEditable={false}/>
                                </div>
                            </div>
                        )
                }))
                : null }
            </div>
        </React.Fragment>
    );
};

export default Artworks;