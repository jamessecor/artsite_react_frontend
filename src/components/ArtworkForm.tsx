import * as React from "react"
import { useCallback, useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { ImInfo } from 'react-icons/im';
import { Col, Form, Stack } from 'react-bootstrap';
import { ArtworkShowingInfoContext } from './Navigation';
import { BackgroundColorContext, isTooLightForDarkTheme, textColor } from "./providers/BackgroundColorProvider";
import { AuthenticationContext } from "./providers/AuthenticationProvider";
import { IArtwork } from "../models/Artwork";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface IArtworkFormResponse {
    data: {
        message: string;
    }
}

interface IArtworkFormProps {
    attributes: IArtwork;
}

const ArtworkForm: React.FC<IArtworkFormProps> = ({ attributes }) => {
    const [title, setTitle] = useState(attributes.title);
    const [year, setYear] = useState(attributes.year);
    const [media, setMedia] = useState(attributes.media);
    const [image, setImage] = useState(attributes.image);
    const [price, setPrice] = useState(attributes.price);
    const { mutate } = useMutation<IArtworkFormResponse, AxiosError, IArtwork>(formData => {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/artworks`, formData);
    });

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        mutate({
            id: attributes.id,
            title,
            year,
            media,
            image,
            price
        });
    }, []);

    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                <Col xs='12'>
                    <MovingColorImage src={attributes.image} title={attributes.title} />
                    <Stack>
                        <Form className={`${textColor(color.r, color.g, color.b)} bg-dark rounded px-2`} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>title</Form.Label>
                                <Form.Control onChange={(e) => setTitle(e.target.value)} value={title} type="title" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="year">
                                <Form.Label>year</Form.Label>
                                <Form.Control onChange={(e) => setYear(e.target.value)} value={year} type="year" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="media">
                                <Form.Label>media</Form.Label>
                                <Form.Control onChange={(e) => setMedia(e.target.value)} value={media} type="media" />
                            </Form.Group>
                        </Form>
                    </Stack>
                </Col>
            )}
        </BackgroundColorContext.Consumer>
    );
}

export default ArtworkForm;
