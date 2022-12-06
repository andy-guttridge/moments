import React from 'react'
import { Navbar, Container, Nav} from 'react-bootstrap'
import logo from '../assets/logo.png'

// Note we use a capital B in NavBar to avoid a naming conflict with the Bootstrap component.
const NavBar = () => {
  return (
    <div>
        <Navbar expand="md" fixed="top">
            <Container>
                {/* Removed the default href attributes from some of the Navbar elements, as we will handle our links in a different way. */}
                <Navbar.Brand><img src={logo}  alt="logo" height="45"></img></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left">
                        <Nav.Link><i className="fas fa-home"></i>Home</Nav.Link>
                        <Nav.Link><i className="fas fa-sign-in-alt"></i>Sign-in</Nav.Link>
                        <Nav.Link><i className="fas fa-user-plus"></i>Sign-up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  )
}

export default NavBar