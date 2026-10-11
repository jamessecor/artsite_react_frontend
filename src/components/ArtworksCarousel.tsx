import { Modal, Carousel, Stack } from "react-bootstrap";
import { getImageSrc, getCaptionText, IArtwork, Groupings } from "../models/Artwork";
import PriceFormatter from "./PriceFormatter";
import useArtworks from "../hooks/useArtworks";
import { useSearchParams } from "react-router-dom";
import { AlphaPicker, Color } from "react-color";
import { useState } from "react";

interface IArtworksCarousel {
    selectedArtwork: IArtwork | null;
    show: boolean;
    onHide: () => void;
    onSelect?: ((eventKey: number, event: Record<string, unknown> | null) => void);
}
const ArtworksCarousel: React.FC<IArtworksCarousel> = ({ selectedArtwork, show, onHide, onSelect }) => {
    const [searchParams, _] = useSearchParams();
    const year = searchParams.get('year') ?? '';
    const grouping = searchParams.get('grouping') as Groupings ?? '';
    const searchTerm = searchParams.get('search') ?? '';
    const { artworksQuery: { data: artworks, isPending: isLoadingArtworks } } = useArtworks({
        year: year,
        grouping: grouping,
        search: searchTerm
    });
    const [hueRotateAmount, setHueRotateAmount] = useState(0);
    return (
        <>
            {artworks && selectedArtwork
                ? (
                    <Modal
                        show={show}
                        onHide={onHide}
                    >
                        <Modal.Header closeButton>
                            Artwork Detail
                        </Modal.Header>
                        <Modal.Body
                            style={{
                                height: '78vh',
                                overflow: "hidden",
                                alignContent: 'center'
                            }}
                        >
                            <Carousel
                                interval={null}
                                activeIndex={artworks.findIndex((a) => a._id === selectedArtwork._id)}
                                slide={false}
                                variant={'dark'}
                                onSelect={onSelect}
                            >
                                {artworks.map((artwork) => (
                                    <Carousel.Item key={artwork._id}>
                                        <img
                                            alt={artwork.title}
                                            className={'w-100'}
                                            src={getImageSrc(artwork.images)}
                                            style={{ filter: `hue-rotate(${hueRotateAmount * 360}deg)` }}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Modal.Body>
                        <Modal.Footer>
                            <AlphaPicker
                                className={'w-100'}
                                color={{ a: hueRotateAmount } as Color}
                                onChange={(newColor) => setHueRotateAmount(newColor.rgb.a ?? 0.0)}
                                onChangeComplete={(newColor) => setHueRotateAmount(newColor.rgb.a ?? 0.0)}
                            />
                            {getCaptionText(selectedArtwork)},
                            <PriceFormatter price={selectedArtwork.price} isSold={Boolean(selectedArtwork.saleDate ?? selectedArtwork.isNFS)} />
                        </Modal.Footer>
                    </Modal>
                ) : null}
        </>
    );
};

export default ArtworksCarousel;