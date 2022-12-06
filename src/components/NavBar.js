import React from 'react';
import { Navbar, Container, Nav} from 'react-bootstrap';
import logo from '../assets/logo.png';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom'

// Note we use a capital B in NavBar to avoid a naming conflict with the Bootstrap component.
const NavBar = () => {
  return (
    <div>
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container>
                {/* Removed the default href attributes from some of the Navbar elements, as we handle our links in a different way. */}
                {/* The to prop of the NavLink component specifies the URL we want this link to navigate to. */}
                <NavLink to="/">
                    <Navbar.Brand><img src={logo}  alt="logo" height="45"></img></Navbar.Brand>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left">
                        {/* The activeClassName prop specifies the class to apply when a specific link is active */}
                        {/* The exact prop on the Home NavLink requires an exact URL match - this stops the icon getting confused by the forward slashes in the other URLs */}
                        <NavLink exact className={styles.NavLink} activeClassName={styles.Active} to="/"><i className="fas fa-home"></i>Home</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/signin"><i className="fas fa-sign-in-alt"></i>Sign-in</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/signup"><i className="fas fa-user-plus"></i>Sign-up</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  )
}

export default NavBar