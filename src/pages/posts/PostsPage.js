import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";

import Post from "./Post";

import NoResults from '../../assets/no-results.png';
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

// Destructure props in place
function PostsPage({ message, filter = "" }) {
    const [posts, setPosts] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);

    // The useLocation hook is from the React library, and returns data about the URL the user is currently on.
    const { pathname } = useLocation();
    
    // useState hooks for the user's search query.
    const [query, setQuery] = useState("");

    const currentUser = useCurrentUser();

    // We pass filter, query and pathname into the useEffect dependency array, so that our code to fetch the posts runs everytime either the filter or pathname is changed, or when the user changes their query text.
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // The filter parameter here comes from the prop we sent in from our <Route> component. We add this and the user's search term to the url we request from the API.
                const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
                // Set the posts to the loaded data and hasLoaded to true so that the spinner is not displayed.
                setPosts(data);
                setHasLoaded(true);
            }
            catch (err) {
                // console.log(err);
            }
        }
        // Set hasLoaded to false before we fetch the posts, so that the loading spinner is displayed.
        // We use setTimeout to delay a second before fetching the posts, so that our search results don't constantly update with every keypress when the user uses the search bar.
        // We also return a clean up function to remove the timer.
        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchPosts();
        }, 1000)
        return () => {
            clearTimeout(timer);
        }
    }, [filter, query, pathname, currentUser])

    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularProfiles mobile />
                <i className={`fas fa-search ${styles.SearchIcon}`} />
                {/* Our search form submission is handled by an onChange event, rather than onSubmit */}
                <Form className={styles.SearchBar}
                    onSubmit={(event) => event.preventDefault()}
                >
                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="text"
                        className="mr-sm-2"
                        placeholder="Search posts"
                    />
                </Form>
                {/* Nested ternaries - have the posts loaded? If yes then display the posts or the no resuts message if none were returned. It not, then show loading spinner. */}
                {/* Note we use the InfiniteScroll component from the React Infinite Scroll Component library. Its children prop takes our array of posts. */}
                {hasLoaded ? (
                    <>
                        {posts.results.length ? (
                            <InfiniteScroll
                                children={
                                    posts.results.map(post => (
                                        // Note we spread the post object to provide props to the Post component, and pass it the setPosts function so that users can like/unlike posts.
                                        <Post key={post.id} {...post} setPosts={setPosts} />
                                    ))
                                }
                                dataLength={posts.results.length} // Tell InfiniteScroll how many posts there are to be displayed.
                                loader={<Asset spinner />} // Pass InfiniteScroll our spinner asset.
                                hasMore={!!posts.next} // Tells InfiniteScroll if there is more data to be loaded after the current page. We use the next value returned by our API to derive a true or false. Because the API returns the number of the next page or null if there aren't any, we use !! to determine if the value is truthy or falsey.
                                next={() => fetchMoreData(posts, setPosts)} // Pass in a function which InfiniteScroll will call if the hasMore prop is true.
                            />
                        ) : (
                            <Container className={appStyles.Content}>
                                {/* Use our Asset component, passing in the NoResults image and the message string we've received from the parent component. */}
                                <Asset src={NoResults} message={message} />
                            </Container>
                        )}
                    </>
                ) : (
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )}
            </Col>
            <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default PostsPage;