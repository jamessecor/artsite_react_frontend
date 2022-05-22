import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from "../config.json";
import MovingColorImage from "./MovingColorImage";
import { Container } from 'react-bootstrap';

const HomePage = () => {
    const navigateTo = useNavigate();
    const enterSite = () => {
        navigateTo('/artworks');
    }
    const [artwork, setArtwork] = useState({image: null, title: null});

    useEffect(() => {
        fetchArtworks();
    }, []);

    const fetchArtworks = () => {
        let params = [];
        params.push("year=2021");
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
                        setArtwork({
                            image: result[0].image,
                            title: result[0].title
                        });
                    }
                }
            )
    }

    return (
        <React.Fragment>
            <MovingColorImage src={artwork.image} title={artwork.title} />

            <button className="position-absolute top-50 start-50 translate-middle btn btn-lg btn-outline-primary" onClick={enterSite}>Enter Site</button>
        </React.Fragment>
    );    
}

export default HomePage;