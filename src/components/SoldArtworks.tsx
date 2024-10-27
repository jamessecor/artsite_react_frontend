import * as React from 'react';
import { useContext, useMemo, useState } from 'react';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./providers/BackgroundColorProvider";
import Artwork from "./Artwork";
import { Col, Container, Row, Spinner, Stack } from 'react-bootstrap';
import useSoldArtworks from '../hooks/useSoldArtworks';
import { TaxStatus } from '../models/Artwork';
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const roundToDollar = (n: number) => Math.round(n * 100) / 100;

interface IArtworkTaxStatusUpdateModel {
    id: string;
    taxStatus: TaxStatus;
}

const SoldArtworks = () => {
    const { color } = useContext(BackgroundColorContext);
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(-1);

    const beginningOfMonth = new Date();
    beginningOfMonth.setDate(0);

    const [startDate, setStartDate] = useState(beginningOfMonth);
    const [endDate, setEndDate] = useState(endOfMonth);

    const { soldArtworksQuery: { data: soldArtworks, isLoading: isLoadingArtworks } } = useSoldArtworks({
        startDate: startDate,
        endDate: endDate
    });

    const total = useMemo(() => soldArtworks
        ? soldArtworks.map((soldArtwork) => soldArtwork.taxStatus === 'paid' ? '0' : soldArtwork.salePrice ?? soldArtwork.price)
            .reduce((sum, b) => sum + parseFloat(b), 0)
        : 0, [soldArtworks]);

    const queryClient = useQueryClient();
    const { isLoading: isSavingTaxStatus, mutate } = useMutation((artworkTaxStatusUpdateModel: IArtworkTaxStatusUpdateModel) => {
        axios.defaults.headers.put['Authorization'] = sessionStorage.getItem('artsite-token');
        axios.defaults.headers.put['Accept'] = 'application/json';
        axios.defaults.headers.put['Content-Type'] = 'application/json';

        return axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${artworkTaxStatusUpdateModel.id}`, {
            taxStatus: artworkTaxStatusUpdateModel.taxStatus.toLocaleString()
        });
    }, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
        }
    });

    return (
        <Container fluid={'sm'} className="align-items-center">
            <Row className={isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text' : 'light-text'}>
                <Col sm={4}>
                    <input type="date" name="start" value={startDate.toISOString().substring(0, 10)} onChange={(e) => setStartDate(new Date(e.target.value))} />
                    <input type="date" name="end" value={endDate.toISOString().substring(0, 10)} onChange={(e) => setEndDate(new Date(e.target.value))} />
                </Col>
                {isLoadingArtworks
                    ? <Spinner variant={'info'} animation={'border'} />
                    : soldArtworks?.map((artwork, i) => {
                        const price = parseFloat(artwork.salePrice ?? artwork.price);
                        return (
                            <Stack
                                gap={2}
                                direction={'horizontal'}
                                className={'mb-1'}
                                onClick={() => mutate({
                                    id: artwork._id!,
                                    taxStatus: artwork.taxStatus === 'paid' ? 'unpaid' : 'paid'
                                })}
                            >
                                <h3 className={'mb-1 pe-2'}>
                                    {artwork.taxStatus === 'paid'
                                        ? <BsToggle2On />
                                        : <BsToggle2Off />
                                    }
                                </h3>
                                {/* Total without tax */}
                                <span>{roundToDollar(price / 1.06)}</span>
                                <span>{'|'}</span>
                                {/* Total with tax */}
                                <span>{price}</span>
                                <span>{'|'}</span>
                                {/* Tax owed */}
                                <span>{roundToDollar((price / 1.06) * 0.06)}</span>
                                <span>{'|'}</span>
                                <span>{artwork.saleDate?.toString().slice(0, 10)}</span>
                                <span>{'|'}</span>
                                <span>{artwork.title}</span>
                            </Stack>
                        )
                    })}
                <hr />
                <div className={'fw-bold'}>
                    {roundToDollar(total / 1.06)} Total without tax
                    <br />{total} TOTAL with tax
                    <br />{total - (total / 1.06)} Taxes Owed
                </div>
            </Row>
            <Row xs={1} lg={4} className={'d-flex align-items-center'}>
                {!isLoadingArtworks
                    ? (soldArtworks?.map((artwork, i) => {
                        return (
                            <Col key={`${artwork._id}-${artwork.title}`} className="my-4 px-4">
                                <Artwork attributes={artwork} />
                            </Col>
                        )
                    }))
                    : null}
            </Row>
        </Container>
    );
};

export default SoldArtworks;