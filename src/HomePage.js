import React from 'react';
import config from "./config.json";
import MovingColorImg from "./MovingColorImg";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.fetchArtworks = this.fetchArtworks.bind(this);
    }

    componentDidMount() {
        this.fetchArtworks();
    }

    fetchArtworks() {
        let params = [];
        params.push("limit=1");
        params.push("year_filter=2021");
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

    render() {
        return (
            <div>
                <MovingColorImg imgClass={"m-0 p-0 h-100 w-100 position-absolute top-0 left-0"} isRotating={true} src={this.state.image}/>

                <button className="position-absolute top-50 start-50 translate-middle btn btn-lg btn-outline-primary " onClick={this.props.enterSite}>Enter</button>
            </div>
        )
    }
}

export default HomePage;