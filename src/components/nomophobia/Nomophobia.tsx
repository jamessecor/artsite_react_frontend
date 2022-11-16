import * as React from "react";
import { useState } from 'react';
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { BackgroundColorContext, textColor } from "../BackgroundColorProvider";
import './Nomophobia.css';
import Canvas from './Canvas';
import PhoneApp from "./PhoneApp";
import { faEdit, faPersonCircleQuestion } from '@fortawesome/free-solid-svg-icons';

export enum Pages {
    Home = 'home',
    Instagram = 'instagram',
    Canvas = 'canvas'
}

const Nomophobia = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<Pages>(Pages.Home);
    const [clear, setClear] = useState(true);

    const getPhoneApp = (currentPage: Pages) => {
        switch (currentPage) {
            case Pages.Home:
                return (
                    <>
                        <PhoneApp page={Pages.Canvas} setCurrentPage={setCurrentPage} icon={faEdit} />
                        <PhoneApp page={Pages.Instagram} setCurrentPage={setCurrentPage} icon={faPersonCircleQuestion} />
                    </>
                );
            case Pages.Canvas:
                return <Canvas
                    onClearCanvas={clearCanvas}
                    isLoading={isLoading}
                    clear={clear}
                    setClear={setClear}
                    height={450}
                    width={275}
                />;
            case Pages.Instagram:
                return <iframe height={450} width={275} src="https://www.instagram.com/jamessecor/embed"></iframe>;
            default:
                return null;
        }
    }

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
                        <Card.Header className={'phone-header'}>
                            <div className={'speaker'} />
                        </Card.Header>
                        <Card.Body className={'justify-content-center p-0 phone-screen'}>
                            { isLoading
                                && (
                                    <div className={'position-absolute top-50 start-50 translate-middle '}>
                                        <Spinner variant={'info'} animation={'border'} />
                                    </div>
                                )}
                            {getPhoneApp(currentPage)}
                            {/* SPOTIFY IFRAME */}
                        </Card.Body>
                        <Card.Footer className={'d-flex justify-content-center phone-footer'}>
                            <Button className={'btn btn-dark phone-app-button'} onClick={() => setCurrentPage(Pages.Home)} />
                        </Card.Footer>
                    </Card>
                </Container>
            )}
        </BackgroundColorContext.Consumer>
    )
}

export default Nomophobia;