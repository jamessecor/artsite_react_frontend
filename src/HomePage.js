import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from "./config.json";
import MovingColorImage from "./MovingColorImage";

const HomePage = () => {
    const navigateTo = useNavigate();
    const enterSite = () => {
        navigateTo('/artworks');
    }

    useEffect(() => {
        fetchArtworks();
    }, []);

    const fetchArtworks = () => {
        let params = [];
        params.push("random=true");
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
                        this.setState({
                            image: result[0].image
                        });
                    }
                }
            )
    }

    return (
        <div>
            {/* <MovingColorImage imgClass={"m-0 p-0 h-100 w-100 position-absolute top-0 left-0"} isRotating={true} src={this.state.image}/> */}

            <button className="position-absolute top-50 start-50 translate-middle btn btn-lg btn-outline-primary" onClick={enterSite}>Enter Site</button>
        </div>
    );    
}

export default HomePage;