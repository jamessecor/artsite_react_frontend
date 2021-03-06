import React from 'react';
import { useState, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
// import LoginForm from "./LoginForm"
import config from "../config.json"
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button';
// import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import './Navigation.css';

const Navigation = () => {
    const navigateTo = useNavigate();
    const { pathname } = useLocation();
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const HideOffcanvasAndNavigateTo = (newPath) => {
        setShowOffcanvas(false);
        navigateTo(newPath);
    };

    // componentDidMount() {
    //     this.loginWithToken();
    //     this.fetchArtworks();
    // }

    // formWillUnmount(formInputs) {
    //     this.setState({contactFormInputs: formInputs});
    // }

    // newArtworkForm() {
    //     if (this.state.isLoggedIn && this.state.currentPage === "artwork") {
    //         return <Artwork isEditable={true} isNew={true}/>
    //     }
    // }

    // loginWithToken() {
    //     if (this.state.token !== undefined) {
    //         fetch(`${config.host}api/users/auto_login?token=${this.state.token}`,
    //             {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json',
    //                 method: "GET"
    //             }
    //         )
    //             .then(res => res.json())
    //             .then(
    //                 (result) => {
    //                     if (result["status"] === "ok") {
    //                         this.setState({isLoggedIn: true})
    //                     }
    //                 }
    //             )
    //     }
    // }

    // // If login is successful, persist the jwt in navigation state
    // // TODO: decide if storing in localStorage is the way to go
    // unmountLoginForm(result) {
    //     this.setState({
    //         isShowingLoginForm: false,
    //         isLoggedIn: result["user"]["admin"],
    //         token: result["jwt"]
    //     })
    //     localStorage["token"] = result["jwt"];
    //     localStorage["user_id"] = result["user"]["id"];
    //     localStorage["email"] = result["user"]["email"];
    // }

    // handleSignOut(e) {
    //     e.preventDefault();
    //     this.setState({
    //         isLoggedIn: false,
    //         token: ""
    //     })
    //     localStorage.removeItem("token")
    // }

    // handleShowLoginForm() {
    //     this.setState({
    //         isShowingLoginForm: true
    //     })
    // }

    const searchTerm = useRef();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // HideOffcanvasAndNavigateTo(`/artworks?search=${searchTerm.current.value}`);
        navigateTo(`/artworks?search=${searchTerm.current.value}`);
    }
    const currentYear = new Date().getFullYear();

    const NavbarLinks = () => (
        <React.Fragment>
            <Nav className="me-auto">
                <NavDropdown title="artwork" id="basic-nav-dropdown">
                    {[...Array(currentYear - config.firstArtworkYear + 1).keys()].map((i) => {
                        return (
                            <NavDropdown.Item 
                                key={i} 
                                data-filter={currentYear - i}
                                data-page-id="artwork"
                                onClick={() => HideOffcanvasAndNavigateTo(`/artworks?year=${currentYear - i}`)}
                            >
                                {currentYear - i}
                            </NavDropdown.Item>
                        );
                    })}
                </NavDropdown>
                <Nav.Link className={pathname === "cv" ? "active" : ""} onClick={() => HideOffcanvasAndNavigateTo('/cv')}>
                    {'cv'}
                </Nav.Link>
                {/* <Nav.Link className={pathname === "contact" ? "active" : ""} onClick={() => navigateTo('/contact')}>contact</Nav.Link> */}
                <Nav.Link className={pathname === "colors" ? "active" : ""} onClick={() => HideOffcanvasAndNavigateTo('/colors')}>colors</Nav.Link>
                <Nav.Link className={pathname === "store" ? "active" : ""} onClick={() => HideOffcanvasAndNavigateTo('/store')}>store</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link disabled>James Secor &copy; 2021</Nav.Link>
                <Nav.Link target="_blank" rel="noopener noreferrer"
                            href="https://www.instagram.com/jamessecor/"
                            className="nav-link instagram-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor"
                            className="bi bi-instagram" viewBox="0 0 16 16">
                        <path
                            d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
                    </svg>
                </Nav.Link>
                {/* <Nav.Link onClick={this.handleSignOut}
                            className={this.state.isLoggedIn ? "nav-link btn btn-link" : "d-none"}
                            eventKey={"log-out"}>
                    Log out
                </Nav.Link>
                <Nav.Link onClick={this.handleShowLoginForm}
                            className={this.state.isLoggedIn ? "d-none" : "nav-link btn btn-link"}
                            eventKey={"log-in"}>
                    Log in
                </Nav.Link> */}
            </Nav>
            <Form onSubmit={handleSearchSubmit} className="d-flex">
                <FormControl
                    // onChange={(e) => {
                    //     e.preventDefault();
                    //     setSearchTerm(e.target.value);
                    // }}
                    type="search"
                    ref={searchTerm}
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                />
                <Button type="submit" variant="outline-success">Search</Button>
            </Form>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <Navbar fixed='top' variant='dark' className="mb-4" collapseOnSelect={true} expand="false">{/* TODO: set to lg and uncomment NavbarCollapse */}
                <Container fluid>
                    <Navbar.Brand onClick={() => navigateTo('/')} data-page-id="home" href="#">
                        James Secor
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={() => setShowOffcanvas(!showOffcanvas)}/>
                    {/* <NavbarCollapse collapseOnSelect={true}>
                        <NavbarLinks />
                    </NavbarCollapse> */}
                    <Navbar.Offcanvas onHide={() => setShowOffcanvas(false)} show={showOffcanvas} scroll={true}>
                        <Offcanvas.Header onHide={() => setShowOffcanvas(false)} closeButton>
                            <Offcanvas.Title>James Secor</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <NavbarLinks />
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            {/* {this.newArtworkForm()}
            {this.currentPageContent()}
            <LoginForm show={this.state.isShowingLoginForm} unmount={this.unmountLoginForm}/> */}
            <div className='outlet-content'>
                <Outlet />
            </div>
        </React.Fragment>
    )
};

export default Navigation;
