import * as React from "react";
import { Carousel } from 'react-bootstrap';
import { press } from "../../data/cv";
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";

const News = () => {
    return (
        <Carousel interval={null} variant={'dark'} >
            {press.map((pressItem) => (
                <Carousel.Item>
                    <iframe height={PHONE_HEIGHT} width={PHONE_WIDTH} src={`${process.env.REACT_APP_BASE_URL}${pressItem.url}`}/>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default News;