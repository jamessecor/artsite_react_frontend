import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import NavigationLinks from './NavigationLinks';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { RiLoginCircleLine, RiSettings5Fill } from 'react-icons/ri';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import useScreenSize from '../../hooks/useScreenSize';
import NavigationSettings from './NavigationSettings';
import './Navigation.css';

const Navigation = () => {
    const navigateTo = useNavigate();
    const { isMobile } = useScreenSize();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <React.Fragment>
            <Navbar fixed='top' variant={'dark'} collapseOnSelect={true} expand={!isMobile}>
                <Container fluid>
                    {isMobile ? (
                        <Navbar.Toggle className='me-auto' onClick={() => setShowOffcanvas(!showOffcanvas)} />
                    ) : null}
                    <Navbar.Brand onClick={() => navigateTo('/')} data-page-id="home" href="#">
                        {'James Secor'}
                    </Navbar.Brand>
                    {isMobile ? (
                        <Navbar.Offcanvas onHide={() => setShowOffcanvas(false)} show={showOffcanvas} scroll={true}>
                            <Offcanvas.Header className={'pb-0'} onHide={() => setShowOffcanvas(false)} closeButton>
                                <Offcanvas.Title>
                                    <Nav>
                                        <Nav.Link className={'px-2'} onClick={() => {
                                            navigateTo('/');
                                            setShowOffcanvas(false);
                                        }}>
                                            {'James Secor'}
                                        </Nav.Link>
                                    </Nav>
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className={'pt-1'}>
                                <NavigationLinks setShowOffcanvas={setShowOffcanvas} />
                                <NavigationSettings />
                                <Nav className={'position-absolute bottom-0 end-0 mb-1 me-1'}>
                                    <Button
                                        variant={'outline-secondary'}
                                        onClick={() => {
                                            navigateTo('/login');
                                            setShowOffcanvas(false);
                                        }}
                                    >
                                        <RiLoginCircleLine />
                                    </Button>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    ) : (
                        <React.Fragment>
                            <NavigationLinks setShowOffcanvas={() => { }} />
                            <OverlayTrigger
                                placement={'top'}
                                trigger={'click'}
                                overlay={(
                                    <Popover>
                                        <Popover.Body>
                                            <NavigationSettings />
                                        </Popover.Body>
                                    </Popover>
                                )}
                            >
                                <Button
                                    className={'position-fixed bottom-0 end-0 m-1'}
                                    onClick={() => setShowSettings(!showSettings)}
                                    variant={'outline-secondary'}
                                >
                                    <RiSettings5Fill />
                                </Button>
                            </OverlayTrigger>
                        </React.Fragment>
                    )}
                </Container>
            </Navbar>
            <Outlet />
        </React.Fragment>

    );
};

export default Navigation;
