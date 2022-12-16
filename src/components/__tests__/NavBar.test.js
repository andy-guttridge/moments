import { render, screen, fireEvent } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";

import NavBar from "../NavBar"

// We need the Router component because the NavBar renders router link components.
// Test that NavBar is rendered and contains a Sign-in link
test('renders NavBar',  () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );
    //  We can use the screen.debug method to output details of the rendered components to the terminal.
    // screen.debug();
    
    // Target our sign-in link using getByRole to tell our test we want to search for a link. Then use expect to assert whether it is in the document.
    const signInLink = screen.getByRole('link', {name: 'Sign-in'})
    expect(signInLink).toBeInTheDocument()
});

// Test that the NavBar contains a link to the user profile for a logged in user.
// Note our callback function is async, as our test will be fetching data and we will be awaiting changes in the document.
// We need the CurrentUserProvider component as this test requires the authentication status of the current user.
test('renders link to the user profile for a logged in user',  async () => {
    render(
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );
    
    // We use await as we are testing a component that appears as the result of an async function..
    // We find the Avatar by finding the 'Profile' text within the Avatar component.
    const profileAvatar = await screen.findByText('Profile');
    // Assert that the profileAvatar can be found in the document.
    expect(profileAvatar).toBeInTheDocument();
});

// Test that sign-in and sign-up buttons are rendered once the user logs out.
test('renders sign-in and sign-up buttons again on logout',  async () => {
    render(
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );

    // We use  the findByRole method because this is an async query.
    
    const signOutLink = await  screen.findByRole('link', {name: 'Sign-out'})
    // We use the fireEvent.click method to simulate a user clicking on our Sign-out link
    fireEvent.click(signOutLink)

    // Asynchronously find the Sign-in and Sign-up links, and assert whether they are in the document.
    const signInLink = await  screen.findByRole('link', {name: 'Sign-in'});
    const signUpLink = await  screen.findByRole('link', {name: 'Sign-up'})

    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
});

