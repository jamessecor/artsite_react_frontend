import * as React from "react"
import { useCallback, useState } from "react"
import MovingColorImage from "./MovingColorImage";
import { Button, Col, Form, Spinner, Stack, Toast, ToastContainer } from 'react-bootstrap';
import { BackgroundColorContext, isTooLightForDarkTheme, textColor } from "./providers/BackgroundColorProvider";
import { IArtwork } from "../models/Artwork";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface IArtworkFormData extends IArtwork {
    file?: File;
}

interface IArtworkFormResponse {
    data: {
        message: string;
        image: string;
        _id: string;
    }
}

interface IArtworkFormProps {
    attributes: IArtwork;
}

const ArtworkForm: React.FC<IArtworkFormProps> = ({ attributes }) => {
    const [id, setId] = useState(attributes._id);
    const [title, setTitle] = useState(attributes.title);
    const [year, setYear] = useState(attributes.year);
    const [media, setMedia] = useState(attributes.media);
    const [price, setPrice] = useState(attributes.price);
    const [image, setImage] = useState(attributes.image);
    const [file, setFile] = useState<File>();

    const [responseMessage, setResponseMessage] = useState('');

    const { reset, isSuccess, isLoading, mutate } = useMutation<IArtworkFormResponse, AxiosError, IArtworkFormData>(formData => {
        axios.defaults.headers.put['Authorization'] = sessionStorage.getItem('artsite-token');
        axios.defaults.headers.post['Authorization'] = sessionStorage.getItem('artsite-token');
        axios.defaults.headers.put['Accept'] = 'multipart/form-data';
        axios.defaults.headers.post['Accept'] = 'multipart/form-data';
        axios.defaults.headers.put['Content-Type'] = 'multipart/form-data';
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

        return id
            ? axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/artworks/${id}`, formData)
            : axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/artworks`, formData);
    }, {
        onSuccess: (data, variables) => {
            setResponseMessage(data.data.message);
            setImage(data.data.image);
            setId(data.data._id);
        }
    });

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        mutate({ title, year, media, image, price, file });
    }, [title, year, media, image, price, file]);

    return (
        <BackgroundColorContext.Consumer>
            {({ color, setColor }) => (
                <Col xs='12'>
                    {responseMessage && (
                        <Toast
                            onClose={() => setResponseMessage('')}
                            style={{ zIndex: 1000 }}
                            className={'mb-2 me-2 position-fixed bottom-0 end-0'}
                            autohide
                            delay={3000}
                        >
                            <Toast.Header>
                                <strong className='me-auto'>
                                    {'Update Message'}
                                </strong>
                            </Toast.Header>
                            <Toast.Body>
                                {responseMessage}
                            </Toast.Body>
                        </Toast>
                    )}
                    <Stack className={`${textColor(color.r, color.g, color.b)} bg-dark rounded p-2`}>
                        <Form onSubmit={handleSubmit}>
                            <MovingColorImage src={image} title={title} />
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
                            <Form.Group className="mb-3" controlId="price">
                                <Form.Label>price</Form.Label>
                                <Form.Control onChange={(e) => setPrice(e.target.value)} value={price} type="text" />
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
