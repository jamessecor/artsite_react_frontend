import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Artwork from "./Artwork";
import config from './config.json';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faToggleOn, faToggleOff, faInfoCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import useIsRotating from './hooks/useIsRotating';
import useIsShowingInfo from './hooks/useIsShowingInfo';

const Artworks = () => {
    const params = useParams();
    const year = params.year ?? '';
    const searchTerm = params.searchTerm ?? '';

    const { isRotating, setIsRotating } = useIsRotating();
    const { isShowingInfo, setIsShowingInfo } = useIsShowingInfo();

    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        async function getArtworks(year, searchTerm) {
            let params = [];
            if (searchTerm !== '') {
                params.push(`search=${searchTerm}`);
            } 
            if (year !== '') {
                params.push(`year=${year}`);
            }
            let works = await fetch(`${config.host}api/artworks?${params.join('&')}`,
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    method: "GET"
                }
            );
            setArtworks(await works.json());
        }

        getArtworks(year, searchTerm);
        
    }, [searchTerm, year]);

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
                                    <Artwork 
                                        isShowingInfo={isShowingInfo} 
                                        allAreRotating={isRotating}
                                        key={artwork.id} 
                                        attributes={artwork} 
                                        isEditable={false}
                                    />
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