import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container'
import {Route, Switch} from 'react-router-dom'

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        {/* The Switch component holds all our Routes, and renders a given component when a Route matches a URL. */}
        {/* The render prop on the Route component returns a component to be rendered when the URL is matched.  */}
        <Switch>
            <Route exact path="/" render={()=> <h1>Home page</h1>} />
            <Route exact path="/signin" render={()=> <h1>Sign in</h1>} />
            <Route exact path="/signup" render={()=> <h1>Sign up</h1> }/>
            {/* We can use this generic route at the end of the Switch component to render a message if no path was found */}
            <Route render={()=><p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;