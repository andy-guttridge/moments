import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container'
import { Route, Switch } from 'react-router-dom'
import './api/axiosDefaults';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import PostCreateForm from './pages/posts/PostCreateForm';
import PostPage from './pages/posts/PostPage';
import PostsPage from './pages/posts/PostsPage';
import { useCurrentUser } from './contexts/CurrentUserContext';
import PostEditForm from './pages/posts/PostEditForm';
import ProfilePage from './pages/profiles/ProfilePage';


function App() {
    // Here we find out if the user is authenticated and who they are, and retrieve their profile id.
    // Note the profile id defaults to an empty string, in case the details are still being fetched in the background.
    const currentUser = useCurrentUser();
    const profile_id = currentUser?.profile_id || "";

    return (
        <div className={styles.App}>
            <NavBar />
            <Container className={styles.Main}>
                {/* The Switch component holds all our Routes, and renders a given component when a Route matches a URL. */}
                {/* The render prop on the Route component returns a component to be rendered when the URL is matched.  */}
                <Switch>
                    <Route exact path="/" render={() => <PostsPage message="No results found. Adjust the search keyword."/>} />
                    {/* For our feed page, we pass in a message which the PostsPage will use if no results are found, and a filter to find just posts by profies our user is following. */}
                    <Route
                        exact
                        path="/feed"
                        render={() => (
                            <PostsPage
                                message="No results found. Adjust the search keyword or follow a user."
                                filter={`owner__followed__owner__profile=${profile_id}&`}
                            />
                        )}
                        
                    />
                    {/* We do the same again for our liked page, but with a different no results message and a different filter. */}
                    <Route
                        exact
                        path="/liked"
                        render={() => (
                            <PostsPage
                                message="No results found. Adjust the search keyword or like a post"
                                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                            />
                        )}
                    />
                    <Route exact path="/signin" render={() => <SignInForm />} />
                    <Route exact path="/signup" render={() => <SignUpForm />} />
                    <Route exact path="/posts/create" render={() => <PostCreateForm />} />
                    {/* The colon before id in path means id is parameter that can be passed through the url. */}
                    <Route exact path="/posts/:id" render={() => <PostPage/>} />
                    <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
                    <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
                    {/* We can use this generic route at the end of the Switch component to render a message if no path was found */}
                    <Route render={() => <p>Page not found!</p>} />
                </Switch>
            </Container>
        </div>
    );
}

export default App;