import * as React from 'react';
import { useContext, useMemo, useState } from 'react';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./providers/BackgroundColorProvider";
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import useSoldArtworks from '../hooks/useSoldArtworks';
import { TaxStatus } from '../models/Artwork';
import { BsToggle2Off as BsToggle2OffIcon, BsToggle2On as BsToggle2OnIcon } from 'react-icons/bs';
const BsToggle2Off = BsToggle2OffIcon as React.ComponentType<any>;
const BsToggle2On = BsToggle2OnIcon as React.ComponentType<any>;
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ArtworkForm from './ArtworkForm';
import Artwork from './Artwork';
import { AuthenticationContext } from './providers/AuthenticationProvider';

export const roundToDollar = (n: number) => Math.round(n * 100) / 100;

interface IArtworkTaxStatusUpdateModel {
    id: string;
    taxStatus: TaxStatus;
}

const SoldArtworks = () => {
    const { isLoggedIn } = useContext(AuthenticationContext);
    const { color } = useContext(BackgroundColorContext);
    const textColorClass = isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text' : 'light-text';
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(-1);

    const beginningOfMonth = new Date();
    beginningOfMonth.setDate(0);

    const [startDate, setStartDate] = useState(beginningOfMonth);
    const [endDate, setEndDate] = useState(endOfMonth);

    const { soldArtworksQuery: { data: soldArtworks, isPending: isLoadingArtworks } } = useSoldArtworks({
        startDate: startDate,
        endDate: endDate
    });

    const total = useMemo(() => soldArtworks
        ? soldArtworks.map((soldArtwork) => soldArtwork.taxStatus === 'paid' ? '0' : soldArtwork.salePrice ?? soldArtwork.price)
            .reduce((sum, b) => sum + parseFloat(b), 0)
        : 0, [soldArtworks]);

    const queryClient = useQueryClient();
    const { isPending: isSavingTaxStatus, mutate } = useMutation({
        mutationFn: (artworkTaxStatusUpdateModel: IArtworkTaxStatusUpdateModel) => {
            axios.defaults.headers.put['Authorization'] = sessionStorage.getItem('artsite-token');
            axios.defaults.headers.put['Accept'] = 'application/json';
            axios.defaults.headers.put['Content-Type'] = 'application/json';

            return axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/artworks/${artworkTaxStatusUpdateModel.id}`, {
                taxStatus: artworkTaxStatusUpdateModel.taxStatus.toLocaleString()
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['artworks'] });
        }
    });

    return (
        <Container fluid={'sm'} className="align-items-center">
            <Row className={textColorClass}>
                <Col sm={4} >
                    Start
                    <input type="date" name="start" value={startDate.toISOString().substring(0, 10)} onChange={(e) => setStartDate(new Date(e.target.value))} />
                </Col>
                <Col sm={4}>
                    End
                    <input type="date" name="end" value={endDate.toISOString().substring(0, 10)} onChange={(e) => setEndDate(new Date(e.target.value))} />
                </Col>
            </Row>
            <div className="table-responsive">
                <table className={`table ${textColorClass}`}>
                    <thead>
                        <tr>
                            <th>Artwork</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Tax ({new Date().getFullYear()}%)</th>
                            <th className="text-end">Total</th>
                            <th>Tax Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingArtworks ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    <Spinner variant={'info'} animation={'border'} />
                                </td>
                            </tr>
                        ) : (
                            soldArtworks?.map((artwork) => {
                                const totalPrice = parseFloat(artwork.salePrice ?? artwork.price);
                                const priceWithoutTax = totalPrice / 1.06;
                                const taxRate = 0.06;
                                const tax = artwork.taxStatus === 'paid' ? 0 : priceWithoutTax * taxRate;

                                return (
                                    <tr
                                        key={artwork._id}
                                        className={artwork.taxStatus === 'paid' ? 'table-success' : ''}
                                    >
                                        <td>{artwork.title}</td>
                                        <td className="text-end">${priceWithoutTax.toFixed(2)}</td>
                                        <td className="text-end">${tax.toFixed(2)}</td>
                                        <td className="text-end fw-bold">${totalPrice.toFixed(2)}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${artwork.taxStatus === 'paid' ? 'btn-success' : 'btn-outline-secondary'}`}
                                                onClick={() => mutate({
                                                    id: artwork._id!,
                                                    taxStatus: artwork.taxStatus === 'paid' ? 'unpaid' : 'paid'
                                                })}
                                                disabled={isSavingTaxStatus}
                                            >
                                                {artwork.taxStatus === 'paid' ? 'Tax Paid' : 'Mark as Paid'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        {soldArtworks && soldArtworks.length > 0 && (
                            <tr className="table-primary fw-bold">
                                <td colSpan={2} className="text-end">Subtotal:</td>
                                <td className="text-end">
                                    ${soldArtworks
                                        .filter(a => a.taxStatus !== 'paid')
                                        .reduce((sum, a) => sum + (parseFloat(a.salePrice ?? a.price) * 0.06), 0)
                                        .toFixed(2)}
                                </td>
                                <td className="text-end">
                                    ${soldArtworks
                                        .reduce((sum, a) => {
                                            const price = parseFloat(a.salePrice ?? a.price);
                                            const tax = a.taxStatus === 'paid' ? 0 : price * 0.06;
                                            return sum + price + tax;
                                        }, 0)
                                        .toFixed(2)}
                                </td>
                                <td></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Row xs={1} lg={4} className={'d-flex align-items-top'}>
                {!isLoadingArtworks
                    ? (soldArtworks?.map((artwork, i) => {
                        return (
                            <Col key={`${artwork._id}-${artwork.title}`} className="my-4 px-4">
                                {isLoggedIn
                                    ? <ArtworkForm attributes={artwork} isInFormMode={false} isInArrangementMode={true} onResponse={() => { }} />
                                    : <Artwork attributes={artwork} />}
                            </Col>
                        )
                    }))
                    : null}
            </Row>
        </Container>
    );
};

export default SoldArtworks;