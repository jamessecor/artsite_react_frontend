import React from "react";
import { Modal } from "react-bootstrap";
import MovingColorImage from "./MovingColorImage";
import { getImageSrc, IArtwork } from "../models/Artwork";

interface IImageModal {
    selectedArtwork: IArtwork | null;
    setSelectedArtwork: React.Dispatch<React.SetStateAction<IArtwork | null>>;
}

const ImageModal: React.FC<IImageModal> = ({ selectedArtwork, setSelectedArtwork }) => (
    <Modal
        show={selectedArtwork !== null}
        onHide={() => setSelectedArtwork(null)}
    >
        <Modal.Header closeButton >
            {selectedArtwork?.title}
        </Modal.Header>
        <Modal.Body>
            {selectedArtwork !== null
                ? <MovingColorImage src={getImageSrc(selectedArtwork.images)} title={selectedArtwork.title} />
                : null}
        </Modal.Body>
    </Modal>
);

export default ImageModal;