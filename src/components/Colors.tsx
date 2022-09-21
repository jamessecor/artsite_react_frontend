import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import Color from "./Color";
import {colorOptions} from "../data/color_options";
import useArtworks from '../hooks/useArtworks';

const Colors = () => {
    const highlightColor = {r: 200, g: 200, b: 0};
    const scrollEl = useRef<HTMLDivElement>(null);
    const { randomArtwork } = useArtworks();
    const artwork = useMemo(() => randomArtwork(), [randomArtwork]);

    useEffect(() => {
        if (scrollEl.current) scrollEl.current.scrollIntoView({behavior: "smooth"});
    }, []);

    // handleChooseColor(e) {
    //     e.preventDefault();
    //     this.setState({
    //         highlightColor: {
    //             r: e.target.dataset.r,
    //             g: e.target.dataset.g,
    //             b: e.target.dataset.b
    //         }
    //     });
    // }

    return (
        <div>
            <div className="d-flex flex-row h-100">
                Choose Your Color
                {/* Add a few colors to choose to be how it changes */}
                <div className="row col-3" ref={scrollEl}>
                    <div className="d-flex">
                        {
                            colorOptions.map((color) => {
                                return (
                                    <div key={`${color.r}${color.g}${color.b}`}
                                            // onClick={handleChooseColor}
                                            data-r={color.r} data-g={color.g} data-b={color.b}
                                            style={{
                                                filter: 'blur(1px)',
                                                background: `rgb(${color.r},${color.g},${color.b})`
                                            }}
                                            className="color w-50"></div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="row vh-100 g-0 container-fluid">
                <img src={artwork.image} />
                {[...Array(336)].map((value, index) => {
                    return (
                        <div key={index} className="col-1">
                            <div className="d-flex h-100">
                                <Color key={`color-a-${index}`} highlightColor={highlightColor}/>
                                <Color key={`color-b-${index}`} highlightColor={highlightColor}/>
                                <Color key={`color-c-${index}`} highlightColor={highlightColor}/>
                                <Color key={`color-d-${index}`} highlightColor={highlightColor}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Colors;