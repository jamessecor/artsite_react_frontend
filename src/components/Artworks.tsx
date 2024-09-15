import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Artwork from "./Artwork";
import { ArtworkAttributes, Groupings, IArtwork } from "../models/Artwork";
import { Badge, Button, Col, Container, Row, Spinner, Stack, Toast } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from './providers/AuthenticationProvider';
import ArtworkForm from './ArtworkForm';
import { MdEdit, MdViewComfy } from 'react-icons/md';
import { SettingsContext } from './providers/SettingsProvider';
import { IoImage } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa";
import useScreenSize from '../hooks/useScreenSize';

interface IArtworkProps {
    current?: boolean;
}

const Artworks = ({ current = false }: IArtworkProps) => {
    const { isLoggedIn } = useContext(AuthenticationContext);
    const { isShowingSold } = useContext(SettingsContext);
    const [searchParams, _] = useSearchParams();
    const year = searchParams.get('year') ?? '';
    const grouping = searchParams.get('grouping') as Groupings ?? '';
    const searchTerm = searchParams.get('search') ?? '';
    const { artworks, setEm, isLoading } = useArtworks();
    const [newArtworks, setNewArtworks] = useState<Array<IArtwork>>([]);
    const [isInArrangementMode, setIsInArrangementMode] = useState(false);
    const [isInFormMode, setIsInFormMode] = useState(false);
    const navigateTo = useNavigate();

    const { isMobile } = useScreenSize();
    const adminButtonsMarginBottom = isMobile ? 1 : 5;

    useEffect(() => {
        setEm(year, grouping, searchTerm, current);
    }, [setEm, year, grouping, searchTerm, current]);

    const enterSite = () => navigateTo('/artworks?year=2023');

    const addNewArtwork = useCallback(() => {
        setNewArtworks([...newArtworks, ArtworkAttributes.create()]);
    }, [newArtworks]);

    const removeNewArtwork = useCallback(() => {
        setNewArtworks(newArtworks.slice(0, -1));
    }, [newArtworks]);

    return (

        <Container fluid={'sm'} className="align-items-center">
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
                            <Button variant={'outline-info'} onClick={() => setIsInArrangementMode(!isInArrangementMode)}>
                                {isInArrangementMode
                                    ? <MdViewComfy />
                                    : <MdEdit />}
                            </Button>
                            <Button variant={'outline-info'} onClick={() => setIsInFormMode(!isInFormMode)}>
                                {isInFormMode
                                    ? <IoImage />
                                    : <FaWpforms />}
                            </Button>
                        </Stack>
                    </React.Fragment>
                )
                : null}
            <Row xs={1} lg={isLoggedIn && !isInArrangementMode ? 6 : 4} className={'d-flex align-items-center justify-content-center'}>
                {isLoggedIn && newArtworks.length !== 0
                    && newArtworks.map((newArtwork, index) => (
                        <ArtworkForm
                            key={index}
                            isInArrangementMode={isInArrangementMode}
                            isInFormMode={isInFormMode}
                            attributes={newArtwork}
                        />
                    ))}
                {artworks.length
                    ? (artworks.filter(x => isShowingSold || !(x.isNFS || x.saleDate)).sort((a, b) => (a.arrangement ?? 9999) - (b.arrangement ?? 9999)).map((artwork, i) => {
                        return (
                            <Col key={`${artwork._id}-${artwork.title}`} className="my-4 px-4">
                                {isLoggedIn
                                    ? <ArtworkForm attributes={artwork} isInFormMode={isInFormMode} isInArrangementMode={isInArrangementMode} />
                                    : <Artwork attributes={artwork} />
                                }
                            </Col>
                        )
                    }))
                    : (
                        isLoading
                            ? (
                                <Stack direction={'vertical'} gap={2} style={{ alignItems: 'center' }}>
                                    <Spinner variant={'info'} animation={'border'} className={'text-center'} />
                                    <h5>
                                        <Badge bg={'info'}>{'Loading artworks'}</Badge>
                                    </h5>
                                </Stack>
                            )
                            : (
                                <Container className={'align-items-center'}>
                                    <Row xs={1}>
                                        <Col>
                                            <Toast
                                                className={'position-absolute top-50 start-50 translate-middle'}
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

                            )
                    )}
            </Row>
        </Container>
    );
};

export default Artworks;