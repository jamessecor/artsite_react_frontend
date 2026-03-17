import * as React from 'react';
import { useContext, useState } from 'react';
import { BackgroundColorContext, isTooLightForDarkTheme } from "./providers/BackgroundColorProvider";
import { Col, Container, Row, Spinner, ButtonGroup, Button } from 'react-bootstrap';
import useSoldArtworks from '../hooks/useSoldArtworks';
import { TaxStatus } from '../models/Artwork';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ArtworkForm from './ArtworkForm';
import Artwork from './Artwork';
import { AuthenticationContext } from './providers/AuthenticationProvider';
import { MdCheck } from 'react-icons/md';
import { getTaxCalculations } from '../utils/taxHelpers';

export const roundToDollar = (n: number) => Math.round(n * 100) / 100;

interface IArtworkTaxStatusUpdateModel {
    id: string;
    taxStatus: TaxStatus;
}

const SoldArtworks = () => {
    const { isLoggedIn } = useContext(AuthenticationContext);
    const { color } = useContext(BackgroundColorContext);
    const textColorClass = isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text' : 'light-text';

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Determine the start month of the current quarter (0-based)
    const currentQuarterStartMonth = Math.floor(currentMonth / 3) * 3;

    // Calculate the start of the last quarter
    const lastQuarterStartMonth = currentQuarterStartMonth - 3;
    const lastQuarterYear = lastQuarterStartMonth < 0 ? currentYear - 1 : currentYear;
    const adjustedLastQuarterStartMonth = (lastQuarterStartMonth + 12) % 12;

    // Set beginning of last quarter (e.g., July 1 for Q3)
    const beginningOfLastQuarter = new Date(lastQuarterYear, adjustedLastQuarterStartMonth, 1);

    // Set end of last quarter (e.g., September 30 for Q3)
    const endOfLastQuarter = new Date(lastQuarterYear, adjustedLastQuarterStartMonth + 3, 0);

    const [startDate, setStartDate] = useState(beginningOfLastQuarter);
    const [endDate, setEndDate] = useState(endOfLastQuarter);

    const [year, setYear] = useState(currentYear);
    const [quarter, setQuarter] = useState(currentQuarterStartMonth / 3 || 1);

    const handleQuarterSelect = (quarter: number, year: number) => {
        // Calculate the start month (0-based: 0=Jan, 3=Apr, 6=Jul, 9=Oct)
        const startMonth = (quarter - 1) * 3;
        const startDate = new Date(year, startMonth, 1);
        const endDate = new Date(year, startMonth + 3, 0); // Last day of the quarter

        setStartDate(startDate);
        setEndDate(endDate);
        setQuarter(quarter);
        setYear(year);
    };

    const { soldArtworksQuery: { data: soldArtworks, isPending: isLoadingArtworks } } = useSoldArtworks({
        startDate: startDate,
        endDate: endDate
    });

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
                <Col sm={12} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>Sales by Quarter</h2>
                        <div className="d-flex gap-2">
                            <ButtonGroup size="sm">
                                {[1, 2, 3, 4].map((q) => (
                                    <Button
                                        key={q}
                                        variant="outline-secondary"
                                        active={quarter === q}
                                        onClick={() => handleQuarterSelect(q, year)}
                                    >
                                        Q{q}
                                    </Button>
                                ))}
                            </ButtonGroup>
                            <ButtonGroup size="sm" className="ms-2">
                                <Button
                                    active={year === currentYear - 1}
                                    variant="outline-secondary"
                                    onClick={() => handleQuarterSelect(quarter, currentYear - 1)}
                                >
                                    {currentYear - 1}
                                </Button>
                                <Button
                                    active={year === currentYear}
                                    variant="outline-secondary"
                                    onClick={() => handleQuarterSelect(quarter, currentYear)}
                                >
                                    {currentYear}
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </Col>
            </Row>
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
                            <th>Date</th>
                            <th>Artwork</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Tax (VT State 6%)</th>
                            <th className="text-end">Tax (Local Option 1%)</th>
                            <th className="text-end">Total Tax</th>
                            <th className="text-end">Total</th>
                            <th>Tax Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingArtworks ? (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    <Spinner variant={'info'} animation={'border'} />
                                </td>
                            </tr>
                        ) : (
                            soldArtworks?.map((artwork) => {
                                const { basePrice, stateTax, localTax, totalTax, totalWithTax } = getTaxCalculations(artwork.salePrice ?? artwork.price);

                                return (
                                    <tr
                                        key={artwork._id}
                                        className={artwork.taxStatus === 'paid' ? '' : 'table-secondary'}
                                    >
                                        <td>{artwork.saleDate ? new Date(artwork.saleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</td>
                                        <td>{artwork.title}</td>
                                        <td className="text-end">${basePrice.toFixed(2)}</td>
                                        <td className="text-end">${stateTax.toFixed(2)}</td>
                                        <td className="text-end">${localTax.toFixed(2)}</td>
                                        <td className="text-end">${totalTax.toFixed(2)}</td>
                                        <td className="text-end fw-bold">${totalWithTax.toFixed(2)}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${artwork.taxStatus === 'paid' ? 'btn-success' : 'btn-outline-success'}`}
                                                onClick={() => mutate({
                                                    id: artwork._id!,
                                                    taxStatus: artwork.taxStatus === 'paid' ? 'unpaid' : 'paid'
                                                })}
                                                disabled={isSavingTaxStatus}
                                            >
                                                <span>{artwork.taxStatus === 'paid' ? 'Tax Paid' : 'Mark as Paid'}</span>
                                                <span className="ms-2">{artwork.taxStatus === 'paid' ? <MdCheck /> : null}</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        {soldArtworks && soldArtworks.length > 0 && (() => {
                            // Calculate all totals in a single reduce pass
                            const totals = soldArtworks.reduce(
                                (acc, artwork) => {
                                    const { basePrice, stateTax, localTax, totalTax, totalWithTax } = getTaxCalculations(artwork.salePrice ?? artwork.price);

                                    if (artwork.taxStatus === 'paid') {
                                        acc.paid.subtotal += basePrice;
                                        acc.paid.stateTaxTotal += stateTax;
                                        acc.paid.localTaxTotal += localTax;
                                        acc.paid.totalTaxTotal += totalTax;
                                        acc.paid.grandTotal += totalWithTax;
                                    } else {
                                        acc.unpaid.subtotal += basePrice;
                                        acc.unpaid.stateTaxTotal += stateTax;
                                        acc.unpaid.localTaxTotal += localTax;
                                        acc.unpaid.totalTaxTotal += totalTax;
                                        acc.unpaid.grandTotal += totalWithTax;
                                    }

                                    acc.total.subtotal += basePrice;
                                    acc.total.stateTaxTotal += stateTax;
                                    acc.total.localTaxTotal += localTax;
                                    acc.total.totalTaxTotal += totalTax;
                                    acc.total.grandTotal += totalWithTax;

                                    return acc;
                                },
                                {
                                    total: { subtotal: 0, stateTaxTotal: 0, localTaxTotal: 0, totalTaxTotal: 0, grandTotal: 0 },
                                    paid: { subtotal: 0, stateTaxTotal: 0, localTaxTotal: 0, totalTaxTotal: 0, grandTotal: 0 },
                                    unpaid: { subtotal: 0, stateTaxTotal: 0, localTaxTotal: 0, totalTaxTotal: 0, grandTotal: 0 }
                                }
                            );

                            return (
                                <>
                                    <tr className="table-primary fw-bold">
                                        <td></td>
                                        <td className="text-end">Total:</td>
                                        <td className="text-end">${totals.total.subtotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.total.stateTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.total.localTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.total.totalTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.total.grandTotal.toFixed(2)}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr className="table-success fw-bold">
                                        <td></td>
                                        <td className="text-end">Paid:</td>
                                        <td className="text-end">${totals.paid.subtotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.paid.stateTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.paid.localTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.paid.totalTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.paid.grandTotal.toFixed(2)}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr className="table-secondary fw-bold">
                                        <td></td>
                                        <td className="text-end">Unpaid:</td>
                                        <td className="text-end">${totals.unpaid.subtotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.unpaid.stateTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.unpaid.localTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.unpaid.totalTaxTotal.toFixed(2)}</td>
                                        <td className="text-end">${totals.unpaid.grandTotal.toFixed(2)}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </>
                            );
                        })()}
                    </tbody>
                </table>
            </div>
            <Row xs={1} lg={4} className={'d-flex align-items-top'}>
                {!isLoadingArtworks
                    ? (soldArtworks?.map((artwork, i) => {
                        return (
                            <Col key={`${artwork._id}-${artwork.title}`} className="my-4 px-4">
                                {isLoggedIn
                                    ? <ArtworkForm attributes={artwork} onResponse={() => { }} />
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