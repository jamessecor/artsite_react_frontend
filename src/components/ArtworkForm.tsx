import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import MovingColorImage from "./MovingColorImage";
import PriceFormatter from "./PriceFormatter";
import { ImInfo } from 'react-icons/im';
import { Button, Col, Form, Spinner, Stack } from 'react-bootstrap';
import { ArtworkShowingInfoContext } from './Navigation';
import { BackgroundColorContext, isTooLightForDarkTheme, textColor } from "./providers/BackgroundColorProvider";
import { AuthenticationContext } from "./providers/AuthenticationProvider";
import { IArtwork } from "../models/Artwork";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface IArtworkFormData extends IArtwork {
    file?: File;
}

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
    const [price, setPrice] = useState(attributes.price);
    const image = attributes.image; // Can't manually change filepath
    const [file, setFile] = useState<File>();

    const { reset, isSuccess, isLoading, mutate } = useMutation<IArtworkFormResponse, AxiosError, IArtworkFormData>(formData => {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/artworks/${attributes._id}`, formData);
    });

    useEffect(() => {
        axios.defaults.headers.put['Authorization'] = sessionStorage.getItem('artsite-token');
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        mutate({ title, year, media, image, price, file });
    }, [title, year, media, image, price, file]);

    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                <Col xs='12'>
                    <Stack className={`${textColor(color.r, color.g, color.b)} bg-dark rounded p-2`}>
                        <Form onSubmit={handleSubmit}>
                            <MovingColorImage src={attributes.image} title={attributes.title} />
                            <Form.Group className="mb-3" controlId="image">
                                <Form.Label>file</Form.Label>
                                <input type={'file'} onChange={(e) => e.target?.files?.length ? setFile(e.target.files[0]) : null} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>title</Form.Label>
                                <Form.Control onChange={(e) => setTitle(e.target.value)} value={title} type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="year">
                                <Form.Label>year</Form.Label>
                                <Form.Control onChange={(e) => setYear(e.target.value)} value={year} type="text" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="media">
                                <Form.Label>media</Form.Label>
                                <Form.Control onChange={(e) => setMedia(e.target.value)} value={media} type="text" />
                            </Form.Group>
                            {isSuccess
                                ? (
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            reset();
                                        }}
                                        variant={'success'}
                                        className={'w-100'}
                                    >
                                        {'Re-Edit'}
                                    </Button>
                                )
                                : (
                                    <Button disabled={isLoading} className={'w-100'} type={'submit'}>
                                        {isLoading
                                            ? <Spinner variant={'info'} animation={'border'} className={'text-center'} />
                                            : 'Update'
                                        }
                                    </Button>
                                )
                            }
                        </Form>
                    </Stack>
                </Col>
            )}
        </BackgroundColorContext.Consumer>
    );
}

export default ArtworkForm;
