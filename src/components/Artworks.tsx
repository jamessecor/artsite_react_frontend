import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Artwork from "./Artwork";
import { ArtworkAttributes, Groupings, IArtwork } from "../models/Artwork";
import { Badge, Button, Col, Container, Row, Spinner, Stack, Toast, ToastContainer } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from './providers/AuthenticationProvider';
import ArtworkForm from './ArtworkForm';
import { MdEdit as MdEditIcon, MdViewComfy as MdViewComfyIcon } from 'react-icons/md';
const MdEdit = MdEditIcon as React.ComponentType<any>;
const MdViewComfy = MdViewComfyIcon as React.ComponentType<any>;
import { SettingsContext } from './providers/SettingsProvider';
import { IoImage as IoImageIcon } from "react-icons/io5";
const IoImage = IoImageIcon as React.ComponentType<any>;
import { FaWpforms as FaWpformsIcon } from "react-icons/fa";
const FaWpforms = FaWpformsIcon as React.ComponentType<any>;
import useScreenSize from '../hooks/useScreenSize';
import { Variant } from 'react-bootstrap/esm/types';

interface IArtworkProps {
    current?: boolean;
}

export interface IResponseType {
    text?: string;
    variant?: Variant;
}

const Artworks = ({ current = false }: IArtworkProps) => {
    const { isLoggedIn } = useContext(AuthenticationContext);
    const { isShowingSold } = useContext(SettingsContext);
    const [searchParams, _] = useSearchParams();
    const year = searchParams.get('year') ?? '';
    const grouping = searchParams.get('grouping') as Groupings ?? '';
    const searchTerm = searchParams.get('search') ?? '';
    const { artworksQuery: { data: artworks, isPending: isLoadingArtworks } } = useArtworks({
        isHomePage: current.toString(),
        year: year,
        grouping: grouping,
        search: searchTerm
    });
    const [newArtworks, setNewArtworks] = useState<Array<IArtwork>>([]);
    const [isInFormMode, setIsInFormMode] = useState(false);
    const [responseToasts, setResponseToasts] = useState<Array<IResponseType>>([]);
    const navigateTo = useNavigate();

    const { isMobile } = useScreenSize();
    const adminButtonsMarginBottom = isMobile ? 1 : 5;

    const enterSite = () => navigateTo('/artworks?year=2024');

    const addNewArtwork = useCallback(() => {
        setNewArtworks([...newArtworks, ArtworkAttributes.create()]);
    }, [newArtworks]);

    const removeNewArtwork = useCallback(() => {
        setNewArtworks(newArtworks.slice(0, -1));
    }, [newArtworks]);

    const addResponseToast = useCallback((responseToast: IResponseType) => {
        setResponseToasts([...responseToasts, responseToast])
    }, [responseToasts]);

    return (
        <Container fluid={'sm'} className="align-items-center">
            <ToastContainer
                position="bottom-end"
                className="p-3 position-fixed"
                style={{ zIndex: 1000 }}
            >
                {responseToasts.map((toast) => (
                    <Toast
                        key={`${toast.text}-${toast.variant}`}
                        bg={toast.variant ?? ''}
                        autohide={true}
                        delay={3000}
                        onClose={() => setResponseToasts((prev) => {
                            if (prev.length <= 1) {
                                return [];
                            }
                            const [_, ...rest] = prev;
                            return rest;
                        })}
                    >
                        <Toast.Header>
                            <strong className='me-auto'>
                                {'Update Message'}
                            </strong>
                        </Toast.Header>
                        <Toast.Body>
                            {toast.text}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
            {isLoggedIn
                ? (
                    <React.Fragment>
                        <Row xs={2} className={'mb-2'}>
                            <Col>
                                <Button variant={'success'} className={'w-100'} onClick={addNewArtwork}>{'+'}</Button>
                            </Col>
                            <Col>
                                <Button variant={'secondary'} className={'w-100'} onClick={removeNewArtwork}>{'-'}</Button>
                            </Col>
                        </Row>
                        <Stack gap={2} className={`position-fixed bottom-0 end-0 mb-${adminButtonsMarginBottom} me-1`}>
                            <Button variant={'outline-info'} onClick={() => setIsInFormMode(!isInFormMode)}>
                                {isInFormMode
                                    ? <IoImage />
                                    : <FaWpforms />}
                            </Button>
                        </Stack>
                    </React.Fragment>
                )
                : null}
            <Row xs={1} lg={4} className={'d-flex align-items-center justify-content-center'}>
                {isLoggedIn && newArtworks.length !== 0
                    && newArtworks.map((newArtwork, index) => (
                        <ArtworkForm
                            key={index}
                            isInFormMode={isInFormMode}
                            attributes={newArtwork}
                            onResponse={addResponseToast}
                        />
                    ))}
                {isLoadingArtworks
                    ? (
                        <Stack direction={'vertical'} gap={2} style={{ alignItems: 'center' }}>
                            <Spinner variant={'info'} animation={'border'} className={'text-center'} />
                            <h5>
                                <Badge bg={'info'}>{'Loading artworks'}</Badge>
                            </h5>
                        </Stack>
                    )
                    : (
                        artworks?.length
                            ? (artworks.filter(x => isShowingSold || !(x.isNFS || x.saleDate)).sort((a, b) => (a.arrangement ?? 9999) - (b.arrangement ?? 9999)).map((artwork, i) => (
                                <Col key={`${artwork._id}-${artwork.title}`} className="my-4 px-4">
                                    {isLoggedIn
                                        ? <ArtworkForm attributes={artwork} isInFormMode={isInFormMode} onResponse={addResponseToast} />
                                        : <Artwork attributes={artwork} />
                                    }
                                </Col>
                            )))
                            : (
                                <Container className={'d-flex justify-content-center text-center w-100 position-absolute top-50 start-50 translate-middle'}>
                                    <Row>
                                        <Col xs={12}>
                                            <Toast
                                                onClose={enterSite}
                                                bg='primary'
                                            >
                                                <Toast.Header>
                                                    <strong className='me-auto'>
                                                        {'No artworks found :('}
                                                    </strong>
                                                </Toast.Header>
                                                <Toast.Body className="d-flex flex-column justify-content-center">
                                                    {'Please try another search or select a different menu option.'}
                                                    <Button variant='outline-info' size='lg' className={'mt-2'} onClick={enterSite}>Return Home</Button>
                                                </Toast.Body>
                                            </Toast>
                                        </Col>
                                    </Row>
                                </Container>
                            ))}
            </Row>
        </Container>
    );
};

export default Artworks;