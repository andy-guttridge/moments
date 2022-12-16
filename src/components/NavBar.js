import React from 'react';
import { Navbar, Container, Nav} from 'react-bootstrap';
import logo from '../assets/logo.png';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom'
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';
import { removeTokenTimestamp } from '../utils/utils';

// Note we use a capital B in NavBar to avoid a naming conflict with the Bootstrap component.
const NavBar = () => {
    
    // Here we access the useCurrentUser and useSetCurrentUser custom hooks defined in CurrentUserContext so that we can find out whether the user is currently authenticated.
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    
    //  Here we destructure the values returned in an object from useClickOutsideToggle.
    const {expanded, setExpanded, ref} = useClickOutsideToggle();

    
    const handleSignOut = async (event) => {
        try {
            await axios.post('dj-rest-auth/logout/');
            setCurrentUser(null);
            // Remove the token time stamp from local storage when the user is logged out.
            removeTokenTimestamp();
        }
        catch(err){
            // console.log(err)
        }
    }

    const addPostIcon = (
        <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/posts/create"><i className="far fa-plus-square"></i>Add post</NavLink>
    )

    // Here we define the icons to display for logged in or logged out users as constants, to tidy our code up.
    // We use a JSX fragment to wrap the links, as JSX expects us to return a single element, but we don't want to use a Div.
    const loggedInIcons =(
        <>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/feed"><i className="fas fa-stream"></i>Feed</NavLink>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/liked"><i className="fas fa-heart"></i>Liked</NavLink>
            <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}><i className="fas fa-sign-out-alt"></i>Sign-out</NavLink>
            <NavLink 
                className={styles.NavLink}
                to={`/profiles/${currentUser?.profile_id}`}
                onClick={() => {}}
            >
                <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
            </NavLink>
        </>
    )
    const loggedOutIcons = (
        <>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/signin"><i className="fas fa-sign-in-alt"></i>Sign-in</NavLink>
            <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/signup"><i className="fas fa-user-plus"></i>Sign-up</NavLink>
        </>
    )

  return (
    <div>
        {/* expanded is a Bootstrap prop, which we set using our prop define above */}
        <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
            <Container>
                {/* Removed the default href attributes from some of the Navbar elements, as we handle our links in a different way. */}
                {/* The to prop of the NavLink component specifies the URL we want this link to navigate to. */}
                <NavLink to="/">
                    <Navbar.Brand><img src={logo}  alt="logo" height="45"></img></Navbar.Brand>
                </NavLink>
                {/* Display addPostIcon if the user is authenticated */}
                {currentUser && addPostIcon}
                {/* Here, onClick calls setExpanded with the opposite of whatever the current state is, as tracked by our expanded prop. */}
                {/* We pass it our ref refHook defined in useClickOutsideToggle.js. This allows us to reference this DOM element elsewhere. */}
                <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left">
                        {/* The activeClassName prop specifies the class to apply when a specific link is active */}
                        {/* The exact prop on the Home NavLink requires an exact URL match - this stops the icon getting confused by the forward slashes in the other URLs */}
                        <NavLink exact className={styles.NavLink} activeClassName={styles.Active} to="/"><i className="fas fa-home"></i>Home</NavLink>
                        {/* Here we use a ternary to render appropriate icons based on user authentication status */}
                        {currentUser ? loggedInIcons : loggedOutIcons}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  )
}

export default NavBar