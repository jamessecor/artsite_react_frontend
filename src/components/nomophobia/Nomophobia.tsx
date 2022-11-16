import * as React from "react";
import { useState } from 'react';
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { BackgroundColorContext, textColor } from "../BackgroundColorProvider";
import './Nomophobia.css';
import Canvas from './Canvas';
import PhoneApp from "./PhoneApp";
import { faEdit, faPersonCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { PHONE_HEIGHT, PHONE_WIDTH } from "./PhoneSize";

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
                    height={PHONE_HEIGHT}
                    width={PHONE_WIDTH}
                />;
            case Pages.Instagram:
                return <iframe height={PHONE_HEIGHT} width={PHONE_WIDTH} src="https://www.instagram.com/jamessecor/embed"></iframe>;
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
                    <div className={'position-absolute top-50 start-50 translate-middle phone d-flex flex-column'}>
                        <div className={'d-flex justify-content-center align-items-center phone-header'}>
                            <div className={'speaker'} />
                        </div>
                        <div className={'justify-content-center p-0 phone-screen'}>
                            { isLoading
                                && (
                                    <div className={'position-absolute top-50 start-50 translate-middle '}>
                                        <Spinner variant={'info'} animation={'border'} />
                                    </div>
                                )}
                            {getPhoneApp(currentPage)}
                            {/* SPOTIFY IFRAME */}
                        </div>
                        <div className={'d-flex justify-content-center align-items-center phone-footer'}>
                            <Button className={'btn btn-dark phone-app-button'} onClick={() => setCurrentPage(Pages.Home)} />
                        </div>
                    </div>
                </Container>
            )}
        </BackgroundColorContext.Consumer>
    )
}

export default Nomophobia;