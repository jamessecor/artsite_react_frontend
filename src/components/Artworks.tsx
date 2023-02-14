import * as React from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Artwork from "./Artwork";
import { Groupings, IArtwork } from "../models/Artwork";
import { Col, Container, Row, Spinner, Toast } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { ArtworkShowingSoldContext } from './Navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthenticationContext } from './providers/AuthenticationProvider';
import ArtworkForm from './ArtworkForm';

interface IArtworkProps {
    current?: boolean;
}

const Artworks = ({ current = false }: IArtworkProps) => {
    const [searchParams, _] = useSearchParams();
    const year = searchParams.get('year') ?? '';
    const grouping = searchParams.get('grouping') as Groupings ?? '';
    const searchTerm = searchParams.get('search') ?? '';
    const { artworks, setEm, isLoading } = useArtworks();
    const navigateTo = useNavigate();

    useEffect(() => {
        setEm(year, grouping, searchTerm, current);
    }, [setEm, year, grouping, searchTerm, current]);

    const enterSite = () => navigateTo('/artworks?year=2022');

    return (
        <AuthenticationContext.Consumer>
            {({ isLoggedIn, setIsLoggedIn }) => (
                <ArtworkShowingSoldContext.Consumer>
                    {(isShowingSold) => (
                        <Container fluid={'sm'} className="align-items-center">
                            <Row xs={1} lg={4} className={'d-flex align-items-center justify-content-center'}>
                                {artworks.length
                                    ? (artworks.filter(x => isShowingSold || !(x.isNFS || x.saleDate)).sort((a, b) => parseInt(b.year) - parseInt(a.year)).map((artwork, i) => {
                                        return (
                                            <Col key={`${artwork.id}-${artwork.title}`} className="my-4 px-4">
                                                {isLoggedIn
                                                    ? <ArtworkForm attributes={artwork} />
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