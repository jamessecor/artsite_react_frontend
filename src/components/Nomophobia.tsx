import * as React from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import { BackgroundColorContext, textColor } from "./BackgroundColorProvider";
import './Nomophobia.css';
import Canvas from './Canvas';

const Nomophobia = () => {
    return (
        <BackgroundColorContext.Consumer>
            {({color, setColor}) => (
                <Container className={'phone-container'}>                        
                    <Card className={'position-absolute top-50 start-50 translate-middle phone'}>
                        <Card.Body className={'phone-screen'}>
                            <Canvas />
                            <Spinner animation={'border'} />
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </BackgroundColorContext.Consumer>
    )
}

export default Nomophobia;