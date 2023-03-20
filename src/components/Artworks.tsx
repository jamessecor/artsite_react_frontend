import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Artwork from "./Artwork";
import { ArtworkAttributes, Groupings, IArtwork } from "../models/Artwork";
import { Col, Container, Row, Spinner, Toast } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { ArtworkShowingSoldContext } from './Navigation';
import { AuthenticationContext } from './providers/AuthenticationProvider';
import ArtworkForm from './ArtworkForm';
import { MdEdit, MdViewComfy } from 'react-icons/md';

interface IArtworkProps {
    current?: boolean;
}

const Artworks = ({ current = false }: IArtworkProps) => {
    const [searchParams, _] = useSearchParams();
    const year = searchParams.get('year') ?? '';
    const grouping = searchParams.get('grouping') as Groupings ?? '';
    const searchTerm = searchParams.get('search') ?? '';
    const { artworks, setEm, isLoading } = useArtworks();
    const [newArtworks, setNewArtworks] = useState<Array<IArtwork>>([]);
    const [isInFormMode, setIsInFormMode] = useState(true);
    const navigateTo = useNavigate();

    useEffect(() => {
        setEm(year, grouping, searchTerm, current);
    }, [setEm, year, grouping, searchTerm, current]);

    const enterSite = () => navigateTo('/artworks?year=2022');

    const addNewArtwork = useCallback(() => {
        setNewArtworks([...newArtworks, ArtworkAttributes.create()]);
    }, [newArtworks]);

    const removeNewArtwork = useCallback(() => {
        setNewArtworks(newArtworks.slice(0, -1));
    }, [newArtworks]);

    return (
        <AuthenticationContext.Consumer>
            {({ isLoggedIn, setIsLoggedIn }) => (
                <ArtworkShowingSoldContext.Consumer>
                    {(isShowingSold) => (
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
                                        <Button variant={'outline-info'} className={'position-fixed bottom-0 end-0 mb-2 me-2'} onClick={() => setIsInFormMode(!isInFormMode)}>
                                            {isInFormMode
                                                ? <MdViewComfy />
                                                : <MdEdit />}
                                        </Button>
                                    </React.Fragment>
                                )
                                : null}
                            <Row xs={1} lg={isLoggedIn && !isInFormMode ? 6 : 4} className={'d-flex align-items-center justify-content-center'}>
                                {isLoggedIn && newArtworks.length !== 0
                                    && newArtworks.map((newArtwork, index) => (
                                        <ArtworkForm
                                            key={index}
                                            isEveryoneInFormMode={isInFormMode}
                                            attributes={newArtwork}
                                        />
                                    ))}
                                {artworks.length
                                    ? (artworks.filter(x => isShowingSold || !(x.isNFS || x.saleDate)).sort((a, b) => (a.arrangement ?? 9999) - (b.arrangement ?? 9999)).map((artwork, i) => {
                                        return (
                                            <Col key={`${artwork._id}-${artwork.title}`} className="my-4 px-4">
                                                {isLoggedIn
                                                    ? <ArtworkForm attributes={artwork} isEveryoneInFormMode={isInFormMode} />
                                                    : <Artwork attributes={artwork} />
                                                }
                                            </Col>
                                        )
                                    }))
                                    : (
                                        isLoading
                                            ? <Spinner variant={'info'} animation={'border'} className={'text-center'} />
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
                    )}
                </ArtworkShowingSoldContext.Consumer>
            )}
        </AuthenticationContext.Consumer>
    );
};

export default Artworks;