import * as React from "react";
import { useState } from 'react';
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { BackgroundColorContext, textColor } from "./BackgroundColorProvider";
import './Nomophobia.css';
import Canvas from './Canvas';

const Nomophobia = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [clear, setClear] = useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    })

    const clearCanvas = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setClear(true);
        }, 1000);
    };

    return (
        <BackgroundColorContext.Consumer>
            {({color, setColor}) => (
                <Container className={'phone-container'}>
                    <Card className={'position-absolute top-50 start-50 translate-middle phone'}>
                        <Card.Body className={'justify-content-center phone-screen'}>
                            { isLoading
                                && (
                                    <div className={'position-absolute top-50 start-50 translate-middle '}>
                                        <Spinner variant={'info'} animation={'border'} />
                                    </div>
                                )}
                            <Canvas isLoading={isLoading} clear={clear} setClear={setClear} props={null} />
                            {/* <iframe width="100%" height="100%" src="https://www.instagram.com/jamessecor/embed"></iframe> */}
                            <Button className={'d-flex align-self-center '} onClick={() => clearCanvas()}>Clear</Button>
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </BackgroundColorContext.Consumer>
    )
}

export default Nomophobia;