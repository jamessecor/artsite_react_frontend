import * as React from "react";
import { useState } from 'react';
import { Card, Container, Spinner } from "react-bootstrap";
import { BackgroundColorContext, textColor } from "./BackgroundColorProvider";
import './Nomophobia.css';
import Canvas from './Canvas';

const Nomophobia = () => {
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    })
    return (
        <BackgroundColorContext.Consumer>
            {({color, setColor}) => (
                <Container className={'phone-container'}>
                    <Card className={'position-absolute top-50 start-50 translate-middle phone'}>
                        <Card.Body className={'phone-screen'}>
                            { isLoading
                                ? (
                                    <div className={'position-absolute top-50 start-50 translate-middle '}>
                                        <Spinner animation={'border'} />
                                    </div>
                                ) : <Canvas />
                            }
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </BackgroundColorContext.Consumer>
    )
}

export default Nomophobia;