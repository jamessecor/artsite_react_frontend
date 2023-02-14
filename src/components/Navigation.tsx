import * as React from 'react';
import { useState, createContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import NavigationLinks from './NavigationLinks';
import { BackgroundColorContext } from './providers/BackgroundColorProvider';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs';
import { SketchPicker, HuePicker } from 'react-color';
import './Navigation.css';

export const ArtworkShowingInfoContext = createContext(true);
export const ArtworkShowingSoldContext = createContext(true);
export const ArtworkRotatingContext = createContext(false);

const Navigation = () => {
    const navigateTo = useNavigate();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [isShowingInfo, setIsShowingInfo] = useState(true);
    const [isShowingSold, setIsShowingSold] = useState(true);
    const [isRotating, setIsRotating] = useState(false);
    const [isUsingColorSelector, setIsUsingColorSelector] = useState(false);

    return (
        <ArtworkShowingInfoContext.Provider value={isShowingInfo}>
            <ArtworkShowingSoldContext.Provider value={isShowingSold}>
                <ArtworkRotatingContext.Provider value={isRotating}>
                    <BackgroundColorContext.Consumer>
                        {({ color, setColor }) => (
                            <React.Fragment>
                                <Navbar fixed='top' variant={'dark'} collapseOnSelect={true} expand={false}>
                                    <Container fluid>
                                        <Navbar.Toggle className='me-auto' onClick={() => setShowOffcanvas(!showOffcanvas)} />
                                        <Navbar.Brand onClick={() => navigateTo('/')} data-page-id="home" href="#">
                                            James Secor
                                        </Navbar.Brand>
                                        <Navbar.Offcanvas onHide={() => setShowOffcanvas(false)} show={showOffcanvas} scroll={true}>
                                            <Offcanvas.Header className={'pb-0'} onHide={() => setShowOffcanvas(false)} closeButton>
                                                <Offcanvas.Title>
                                                    <Nav>
                                                        <Nav.Link className={'px-2'} onClick={() => navigateTo('/')}>James Secor</Nav.Link>
                                                    </Nav>
                                                </Offcanvas.Title>
                                            </Offcanvas.Header>
                                            <Offcanvas.Body className={'pt-1'}>
                                                <NavigationLinks setShowOffcanvas={setShowOffcanvas} />
                                                <Nav className={'mt-2 p-2 border rounded border-3 border-secondary'}>
                                                    <div className={'text-center'}>
                                                        <Badge pill={true} className={'bg-secondary w-100'}>
                                                            {'Settings'}
                                                        </Badge>
                                                    </div>
                                                    <Nav.Link className={'py-0 no-hover'} onClick={() => setIsShowingInfo(!isShowingInfo)}>
                                                        <div className={'d-flex align-items-center'}>
                                                            <h3 className={'mb-1 pe-2'}>{isShowingInfo ? <BsToggle2On /> : <BsToggle2Off />}</h3>
                                                            {'Show Artwork Info'}
                                                        </div>
                                                    </Nav.Link>
                                                    <Nav.Link className={'py-0 no-hover'} onClick={() => setIsShowingSold(!isShowingSold)}>
                                                        <div className={'d-flex align-items-center'}>
                                                            <h3 className={'mb-1 pe-2'}>{isShowingSold ? <BsToggle2On /> : <BsToggle2Off />}</h3>
                                                            {' Show Sold Artworks'}
                                                        </div>
                                                    </Nav.Link>
                                                    <Nav.Link className={'py-0 no-hover'} onClick={() => setIsRotating(!isRotating)}>
                                                        <div className={'d-flex align-items-center'}>
                                                            <h3 className={'mb-1 pe-2'}>{isRotating ? <BsToggle2On /> : <BsToggle2Off />}</h3>
                                                            {' Wild Colors'}
                                                        </div>
                                                    </Nav.Link>
                                                    <Nav.Link className={'py-0 no-hover'} onClick={() => setIsUsingColorSelector(!isUsingColorSelector)}>
                                                        <div className={'d-flex align-items-center'}>
                                                            <h3 className={'mb-1 pe-2'}>{isUsingColorSelector ? <BsToggle2On /> : <BsToggle2Off />}</h3>
                                                            {' Select Background Color'}
                                                        </div>
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

                                                    {
                                                        isUsingColorSelector
                                                            ? (
                                                                <HuePicker
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
            </ArtworkShowingSoldContext.Provider>
        </ArtworkShowingInfoContext.Provider>
    )
};

export default Navigation;
