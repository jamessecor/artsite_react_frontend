import * as React from 'react';
import { Stack } from 'react-bootstrap';
import { BsHeartFill } from 'react-icons/bs';
import useArtworks from '../../hooks/useArtworks';
import MovingColorImage from '../MovingColorImage';

const Likes = () => {
    const { likedArtworks, isLoading } = useArtworks();

    return (
        <Stack>
            <h6>{'Leader board'}</h6>
            {likedArtworks.map((likedArtwork, index) => (
                <Stack direction={'horizontal'} style={{ justifyContent: 'space-between' }}>
                    <Stack direction={'horizontal'}>
                        {index + 1}.
                        <div className={'w-25'}>
                            <MovingColorImage src={likedArtwork.image} title={likedArtwork.title} />
                        </div>
                        {likedArtwork.title}
                    </Stack>
                    <Stack direction={'horizontal'}>
                        {likedArtwork.totalLikes}
                        <BsHeartFill />
                    </Stack>
                </Stack>
            ))}
        </Stack>
    );

};

export default Likes;