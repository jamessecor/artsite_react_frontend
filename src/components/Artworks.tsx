import * as React from 'react';
import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Artwork from "./Artwork";
import { Groupings, IArtwork } from "../models/Artwork";
import { Badge, Button, Col, Container, Row, Spinner, Stack, Toast, ToastContainer } from 'react-bootstrap';
import useArtworks from '../hooks/useArtworks';
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from './providers/AuthenticationProvider';
import ArtworkForm from './ArtworkForm';
import { SettingsContext } from './providers/SettingsProvider';
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
    const [showArtworkForm, setShowArtworkForm] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState<IArtwork | null>(null);

    const navigateTo = useNavigate();

    const enterSite = () => navigateTo('/artworks?year=2024');

    return (
        <Container fluid={'sm'} className="align-items-center">
            <ArtworkForm
                artwork={selectedArtwork}
                show={showArtworkForm}
                onClose={() => {
                    setShowArtworkForm(false);
                    setSelectedArtwork(null);
                }}
            />
            {isLoggedIn
                ? (
                    <Button onClick={() => {
                        setSelectedArtwork(null);
                        setShowArtworkForm(true);
                    }}>
                        Add New Artwork
                    </Button>
                )
                : null}
            <Row xs={1} lg={4} className={'d-flex align-items-center justify-content-center'}>
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
                                        ? <Artwork attributes={artwork} onClick={() => {
                                            setSelectedArtwork(artwork);
                                            setShowArtworkForm(true);
                                        }} />
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