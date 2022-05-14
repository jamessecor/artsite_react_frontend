import React from "react"
import { useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const Artwork = ({attributes, isRotating}) => {
    const [isShowingInfo, setIsShowingInfo] = useState(false);
    const toggleShowInfo = () => setIsShowingInfo(!isShowingInfo);

    // useEffect(() => {
        
    // });

    return (
        <div className="row justify-content-center">
            <div className="col-md-10 col-10 px-1">
                <MovingColorImage isRotating={isRotating} src={attributes.image}/>
            </div>
            <div className="align-self-end ps-0 col-lg-1 col-1">
                <FontAwesomeIcon icon={isShowingInfo ? faTimesCircle : faInfoCircle} onClick={() => toggleShowInfo()}/>
            </div>
            {isShowingInfo ?
                (
                    <div className="d-flex flex-column ms-2">
                        <div className="fw-bold">{attributes.title}</div>
                        <div>{attributes.year}</div>
                        <div>{attributes.medium}</div>
                        <PriceFormatter value={attributes.price} saleDate={attributes.saleDate}/>
                    </div>
                ) : null}
        </div>
    );
}

export default Artwork;
