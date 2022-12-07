import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container'
import {Route, Switch} from 'react-router-dom'
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import { useState, useEffect, createContext } from 'react';
import axios from 'axios';

// Here we use the React createContext function to create context objects that we can export for reference in other components.
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    
    // We handle our network request to check whether the user is authenticated when the component mounts.
    const handleMount = async () => {
        try {
            // Here we destructure the data property in place.
            const {data} = await axios.get('dj-rest-auth/user/');
            // Set the current user with the data we get back.
            setCurrentUser(data);
        }
        catch(err){
            console.log(err)
        }
    }
    
    // Here we pass useEffect() an empty dependency array, so it only runs when the component is first mounted.
    useEffect(() => {
        handleMount()
    }, [])

  return (
        // Here we use the context objects we created and exported above to make Provider components available to child components.
        // These accept a value which can be accessed in the children which are subscribed to these contexts.
      <CurrentUserContext.Provider value={currentUser}>
          <SetCurrentUserContext.Provider value={setCurrentUser}>
              <div className={styles.App}>
                  <NavBar />
                  <Container className={styles.Main}>
                      {/* The Switch component holds all our Routes, and renders a given component when a Route matches a URL. */}
                      {/* The render prop on the Route component returns a component to be rendered when the URL is matched.  */}
                      <Switch>
                          <Route exact path="/" render={() => <h1>Home page</h1>} />
                          <Route exact path="/signin" render={() => <SignInForm />} />
                          <Route exact path="/signup" render={() => <SignUpForm />} />
                          {/* We can use this generic route at the end of the Switch component to render a message if no path was found */}
                          <Route render={() => <p>Page not found!</p>} />
                      </Switch>
                  </Container>
              </div>
          </SetCurrentUserContext.Provider>
      </CurrentUserContext.Provider>
  );
}

export default App;