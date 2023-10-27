import * as React from 'react';
import { Spinner, Stack } from 'react-bootstrap';
import { BsHeartFill } from 'react-icons/bs';
import useArtworks from '../../hooks/useArtworks';
import { getImageSrc } from '../../models/Artwork';
import MovingColorImage from '../MovingColorImage';

const Likes = () => {
    const { likedArtworks, isLoading } = useArtworks();

    return (
        <Stack className={'phone-screen'}>
            <h5 className={'text-center mt-1'}>{'Leader board'}</h5>
            {isLoading
                ? (
                    <div className={'text-center'}>
                        <Spinner
                            animation={'border'}
                            variant={'info'}
                        />
                    </div>
                ) : (
                    likedArtworks.map((likedArtwork, index) => (
                        <Stack
                            key={`${likedArtwork.title}-${likedArtwork._id?.toString()}-${index}`}
                            direction={'horizontal'}
                            style={{ justifyContent: 'space-between' }}
                        >
                            <Stack direction={'horizontal'}>
                                {index + 1}.
                                <div className={'w-25'}>
                                    <MovingColorImage src={getImageSrc(likedArtwork.images)} title={likedArtwork.title} />
                                </div>
                                {likedArtwork.title}
                            </Stack>
                            <Stack direction={'horizontal'}>
                                <BsHeartFill />
                                {likedArtwork.totalLikes}
                            </Stack>
                        </Stack>
                    )))}
        </Stack>
    );

};

export default Likes;