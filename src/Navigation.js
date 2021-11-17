import React from 'react'
import Cv from "./Cv"
import Artworks from "./Artworks"
import ContactForm from "./ContactForm"
import LoginForm from "./LoginForm"
import config from "./config.json"
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 'artwork',
            isLoggedIn: false,
            isShowingLoginForm: false,
            filter: props.filter === undefined ? "" : props.filter,
            searchTerm: props.searchTerm,
            artworks: [],
            isArtworkDropdownOpen: false,
            contactFormInputs: null
        }

        this.handleClick = this.handleClick.bind(this)
        this.currentPageContent = this.currentPageContent.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
        this.fetchArtworks = this.fetchArtworks.bind(this)
        this.toggleArtworkDropdown = this.toggleArtworkDropdown.bind(this)

        this.formWillUnmount = this.formWillUnmount.bind(this);

        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.unmountLoginForm = this.unmountLoginForm.bind(this);
    }

    componentDidMount() {
        this.fetchArtworks();
    }

    formWillUnmount(formInputs) {
        this.setState({contactFormInputs: formInputs});
    }

    loginForm() {
        if (this.state.isShowingLoginForm) {
            return <LoginForm unmount={this.unmountLoginForm}/>
        }
    }

    // If login is successful, persist the jwt in navigation state
    // TODO: decide if storing in localStorage is the way to go
    unmountLoginForm(result) {
        this.setState({
            isShowingLoginForm: false,
            isLoggedIn: result["user"]["admin"],
            token: result["jwt"]
        })
        localStorage["token"] = result["jwt"];
        localStorage["user_id"] = result["user"]["id"];
        localStorage["email"] = result["user"]["email"];
    }

    currentPageContent() {
        switch (this.state.currentPage) {
            case "artwork":
                return <Artworks artworks={this.state.artworks} isLoggedIn={this.state.isLoggedIn}/>
            case "search":
                return <Artworks artworks={this.state.artworks} isLoggedIn={this.state.isLoggedIn}/>
            case "cv":
                return <Cv isLoggedIn={this.state.isLoggedIn}/>
            case "contact":
                return <ContactForm formWillUnmount={this.formWillUnmount} inputs={this.state.contactFormInputs}/>
            default:
                return <Artworks artworks={this.state.artworks} isLoggedIn={this.state.isLoggedIn}/>
        }
    }

    handleSignOut(e) {
        e.preventDefault();
        this.setState({
            isLoggedIn: false,
            token: ""
        })
    }

    handleSignIn() {
        this.setState({
            isShowingLoginForm: true
        })
    }

    handleClick(e) {
        e.preventDefault()
        this.setState({
            currentPage: e.target.dataset.pageId,
            filter: e.target.dataset.filter === undefined ? "" : e.target.dataset.filter,
            searchTerm: undefined,
            isArtworkDropdownOpen: false
        }, () =>  {
            if(["artwork", "search"].includes(this.state.currentPage)) {
                this.fetchArtworks();
            }
        })
    }

    handleSearchSubmit(e) {
        e.preventDefault();
        this.setState({
            currentPage: "search"
        }, () => this.fetchArtworks())
    }

    handleSearchChange(e) {
        e.preventDefault();
        this.setState({
            searchTerm: e.target.value
        })
    }

    toggleArtworkDropdown(e) {
        e.preventDefault();
        this.setState({
            isArtworkDropdownOpen: !this.state.isArtworkDropdownOpen
        })
    }

    fetchArtworks() {
        let params = [];
        console.log(this.state);
        if (this.state.searchTerm !== undefined) {
            params.push(`search=${this.state.searchTerm}`);
        } else {
            if (this.state.filter !== undefined) {
                params.push(`year_filter=${this.state.filter}`);
            }
            if (this.state.currentPage === "home") {
                params.push("limit=1");
            }
        }
        fetch(`${config.host}api/artworks?${params.join('&')}`,
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                method: "GET"
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.length !== 0) {
                        this.setState({
                            artworks: result
                        });
                    }
                }
            )
    }

    render() {
        const currentYear = new Date().getFullYear();
        return (
            <div>
                <Navbar expand="lg">
                    <Container fluid>
                        <Navbar.Brand onClick={this.props.returnHome} data-page-id="home" href="#">James
                            Secor</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title="artwork" id="basic-nav-dropdown">
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                        {this.state.currentPage === "artwork" ? this.state.filter : ""}
                                    </span>
                                    {[...Array(currentYear - config.firstArtworkYear + 1).keys()].map((i) => {
                                        return (
                                            <NavDropdown.Item key={i} onClick={this.handleClick} data-filter={currentYear - i}
                                                              data-page-id="artwork">{currentYear - i}</NavDropdown.Item>
                                        );
                                    })}
                                </NavDropdown>
                                <Nav.Link className={this.state.currentPage === "cv" ? "active" : ""} data-page-id="cv"
                                          onClick={this.handleClick}>cv</Nav.Link>
                                <Nav.Link data-page-id="contact"
                                          className={this.state.currentPage === "contact" ? "active" : ""}
                                          onClick={this.handleClick}>contact</Nav.Link>

                            </Nav>
                            <Nav>
                                <Nav.Link disabled>James Secor &copy; 2021</Nav.Link>
                                <Nav.Link href="https://www.instagram.com/jamessecor/"
                                          className="nav-link instagram-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor"
                                         className="bi bi-instagram" viewBox="0 0 16 16">
                                        <path
                                            d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path>
                                    </svg>
                                </Nav.Link>
                                <Nav.Link onClick={this.handleSignOut}
                                          className={this.state.isLoggedIn ? "nav-link btn btn-link" : "d-none"}>
                                    Log out
                                </Nav.Link>
                                <Nav.Link onClick={this.handleSignIn}
                                          className={this.state.isLoggedIn ? "d-none" : "nav-link btn btn-link"}>Log
                                    in</Nav.Link>
                            </Nav>
                            <Form onSubmit={this.handleSearchSubmit} className="d-flex">
                                <FormControl
                                    onChange={this.handleSearchChange}
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                />
                                <Button variant="outline-success">Search</Button>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                {this.currentPageContent()}
                {this.loginForm()}
            </div>
        )
    }


}

export default Navigation
