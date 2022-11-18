import * as React from "react";
import { Carousel } from 'react-bootstrap';
import { press } from "../../data/cv";
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";

const News = () => {
    return (
        <Carousel>
            {press.map((pressItem) => (
                <Carousel.Item>
                    <iframe height={PHONE_HEIGHT} width={PHONE_WIDTH} src={`https://jamessecor.com${pressItem.url}`}/>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default News;