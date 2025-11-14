import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { IArtworkFormData } from "./ArtworkForm";
import { Groupings } from "../models/Artwork";
import useArtworksMetadata from "../hooks/useArtworksMetadata";

interface IArtworkFormFieldsProps {
    currentAttributes: IArtworkFormData;
    setCurrentAttributes: (attributes: IArtworkFormData) => void;
    isPending: boolean;
    id?: string;
}

const ArtworkFormFields: React.FC<IArtworkFormFieldsProps> = ({ currentAttributes, setCurrentAttributes, isPending, id }) => {
    const { data: artworksMetaData, isLoading: isLoadingArtworksMetaData } = useArtworksMetadata();

    return (
        <div className="container-fluid">
            <div className="row">
                {/* First Column */}
                <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>File</Form.Label>
                        <input
                            className="form-control"
                            type="file"
                            onChange={(e) => e.target?.files?.length && setCurrentAttributes({
                                ...currentAttributes,
                                file: e.target.files[0]
                            })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                title: e.target.value
                            })}
                            value={currentAttributes.title}
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="year">
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                year: e.target.value
                            })}
                            value={currentAttributes.year}
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="media">
                        <Form.Label>Media</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                media: e.target.value
                            })}
                            value={currentAttributes.media}
                            type="text"
                        />
                    </Form.Group>
                </div>

                {/* Second Column */}
                <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="width">
                        <Form.Label>Width</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                width: e.target.value
                            })}
                            value={currentAttributes.width}
                            type="text"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="height">
                        <Form.Label>Height</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                height: e.target.value
                            })}
                            value={currentAttributes.height}
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                price: e.target.value
                            })}
                            value={currentAttributes.price}
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="salePrice">
                        <Form.Label>Sale Price (including tax)</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                salePrice: e.target.value
                            })}
                            value={currentAttributes.salePrice}
                            type="text"
                        />
                    </Form.Group>
                </div>
            </div>

            {/* Full Width Fields */}
            <div className="row">
                <div className="col-12">
                    <Form.Group className="mb-3" controlId="grouping">
                        <Form.Label className="text-break">
                            {isLoadingArtworksMetaData
                                ? 'Tags'
                                : artworksMetaData?.groupings}
                        </Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                grouping: e.target.value.split(',') as Array<Groupings>
                            })}
                            value={currentAttributes.grouping}
                            type="text"
                            placeholder="Enter tags separated by commas"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="saleDate">
                        <Form.Label>Sale Date</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                saleDate: e.target.value === '' ? null : new Date(e.target.value)
                            })}
                            value={currentAttributes.saleDate ? new Date(currentAttributes.saleDate).toISOString()?.substring(0, 10) : ''}
                            type="date"
                        />
                    </Form.Group>
                </div>
            </div>

            {/* Two Columns Again */}
            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="buyerName">
                        <Form.Label>Buyer Name</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                buyerName: e.target.value
                            })}
                            value={currentAttributes.buyerName}
                            type="text"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="buyerEmail">
                        <Form.Label>Buyer Email</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                buyerEmail: e.target.value
                            })}
                            value={currentAttributes.buyerEmail}
                            type="email"
                        />
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="buyerPhone">
                        <Form.Label>Buyer Phone</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                buyerPhone: e.target.value
                            })}
                            value={currentAttributes.buyerPhone}
                            type="tel"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="location">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                location: e.target.value
                            })}
                            value={currentAttributes.location}
                            type="text"
                        />
                    </Form.Group>
                </div>
            </div>

            {/* Switches in a Row */}
            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="isNFS">
                        <Form.Check
                            label="Not For Sale (NFS)"
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                isNFS: !currentAttributes.isNFS
                            })}
                            checked={currentAttributes.isNFS}
                            type="switch"
                        />
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="mb-3" controlId="isHomePage">
                        <Form.Check
                            label="Show on Home Page"
                            onChange={(e) => setCurrentAttributes({
                                ...currentAttributes,
                                isHomePage: !currentAttributes.isHomePage
                            })}
                            checked={currentAttributes.isHomePage}
                            type="switch"
                        />
                    </Form.Group>
                </div>
            </div>
            <Button disabled={isPending} className="w-100 mt-3" type="submit" variant="primary">
                {isPending ? (
                    <Spinner variant="light" size="sm" />
                ) : id ? 'Update' : 'Add New Artwork'}
            </Button>
        </div>
    );
};

export default ArtworkFormFields;