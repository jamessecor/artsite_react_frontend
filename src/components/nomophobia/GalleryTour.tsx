import * as React from "react";
import { Carousel } from 'react-bootstrap';
import { IGalleryTour } from "../../data/gallery-tour/chirping-in-the-thickets";
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";

interface IGalleryParams {
    images: Array<IGalleryTour>;
}

const GalleryTour: React.FC<IGalleryParams> = ({ images }) => {
    return (
        <Carousel slide={false} variant={'dark'} >
            {images.map((image) => (
                <Carousel.Item key={image.key}>
                    <img
                        height={PHONE_HEIGHT}
                        width={PHONE_WIDTH}
                        src={`${import.meta.env.VITE_BASE_URL}/${image.src}`}
                        style={{ objectFit: 'cover' }}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default GalleryTour;