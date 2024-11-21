import * as React from 'react';
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";
import { Stack } from 'react-bootstrap';

const Video = () => (
    <Stack
        direction={'vertical'}
        className={'d-flex justify-content-center'}
        style={{
            height: PHONE_HEIGHT,
            backgroundColor: 'black'
        }}
    >
        <iframe width={PHONE_WIDTH} src="https://www.youtube.com/embed/bdJxa80zmHI" title="James Secor: Color and process" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </Stack>
)

export default Video;