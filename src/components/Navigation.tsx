import * as React from 'react';
import { useState, createContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import NavigationLinks from './NavigationLinks';
import { BackgroundColorContext, isTooLightForDarkTheme } from './BackgroundColorProvider';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { SketchPicker } from 'react-color';
import './Navigation.css';

export const ArtworkShowingInfoContext = createContext(true);
export const ArtworkRotatingContext = createContext(false);

const Navigation = () => {
    const navigateTo = useNavigate();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [isShowingInfo, setIsShowingInfo] = useState(true);
    const [isRotating, setIsRotating] = useState(false);
    const [isUsingColorSelector, setIsUsingColorSelector] = useState(false);

    return (
        <ArtworkShowingInfoContext.Provider value={isShowingInfo}>
            <ArtworkRotatingContext.Provider value={isRotating}>
                <BackgroundColorContext.Consumer>
                    {({color, setColor}) => (
                        <React.Fragment>
                            <Navbar fixed='top' variant={isTooLightForDarkTheme(color.r, color.g, color.b) ? 'light' : 'dark'} className="mb-4" collapseOnSelect={true} expand={false}>
                                <Container fluid>
                                    <Navbar.Toggle className='me-auto' onClick={() => setShowOffcanvas(!showOffcanvas)}/>
                                    <Navbar.Brand onClick={() => navigateTo('/')} data-page-id="home" href="#">
                                        James Secor
                                    </Navbar.Brand>
                                    <Navbar.Offcanvas onHide={() => setShowOffcanvas(false)} show={showOffcanvas} scroll={true}>
                                        <Offcanvas.Header onHide={() => setShowOffcanvas(false)} closeButton>
                                            <Offcanvas.Title>
                                                <Nav>
                                                    <Nav.Link onClick={() => navigateTo('/')}>James Secor</Nav.Link>
                                                </Nav>
                                            </Offcanvas.Title>
                                        </Offcanvas.Header>
                                        <Offcanvas.Body>
                                            <NavigationLinks setShowOffcanvas={setShowOffcanvas} />
                                            <Nav className={'mt-5 p-2 border rounded border-2 border-light'}>
                                                <div className={'ms-5'}>{'Settings'}</div>
                                                <Nav.Link className={'no-hover'} onClick={() => setIsShowingInfo(!isShowingInfo)}>
                                                    <FontAwesomeIcon size={'lg'} icon={isShowingInfo ? faToggleOn : faToggleOff}/>
                                                    {' Show Artwork Info'}
                                                </Nav.Link>
                                                <Nav.Link className={'no-hover'} onClick={() => setIsRotating(!isRotating)}>
                                                    <FontAwesomeIcon size={'lg'} icon={isRotating ? faToggleOn : faToggleOff}/>
                                                    {' Wild Colors'}
                                                </Nav.Link>
                                                <Nav.Link className={'no-hover'} onClick={() => setIsUsingColorSelector(!isUsingColorSelector)}>
                                                    <FontAwesomeIcon size={'lg'} icon={isUsingColorSelector ? faToggleOn : faToggleOff}/>
                                                    {' Select Background Color'}
                                                </Nav.Link>
                                                {
                                                    isUsingColorSelector
                                                        ? (
                                                            <SketchPicker
                                                                className={'mt-1 align-self-center'}
                                                                color={color}
                                                                onChange={(newColor) => setColor(newColor.rgb)}
                                                                onChangeComplete={(newColor) => setColor(newColor.rgb)}
                                                            />
                                                        )
                                                        : null}
                                            </Nav>
                                        </Offcanvas.Body>
                                    </Navbar.Offcanvas>
                                </Container>
                            </Navbar>
                            <Outlet />
                        </React.Fragment>
                    )}
                </BackgroundColorContext.Consumer>
            </ArtworkRotatingContext.Provider>
        </ArtworkShowingInfoContext.Provider>
    )
};

export default Navigation;
