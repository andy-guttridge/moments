import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults"
import Post from "./Post";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function PostPage() {
    // We use the useParams hook to access parameters passed in via a URL. We destructure it in place using the name of the parameter we defined in the <Route> component in App.js.
    const { id } = useParams();
    // We set our post prop to an object with a key and an empty array. We use an array because the API may return either a single post or an array of posts, so to ensure we are compatible no matter what we get back from the API, we use an array.
    const [post, setPost] = useState({ results: [] })

    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;
    const [comments, setComments] = useState({ results: [] });

    //  Note we pass useEffect a dependency array containing id, so the handleMount function will be called everytime the id prop changes.
    useEffect(() => {
        const handleMount = async () => {
            try {
                // Here we use destructuring to rename the object key returned from the get request.
                // Promise.all accepts an array of promises, and gets resolved when all the promises are resolved, returning an array of data. If any of the promises are rejected, it fails with an error.
                const [{ data: post }, {data: comments}] = await Promise.all([
                    axiosReq.get(`/posts/${id}`),
                    axiosReq.get(`/comments/?post=${id}`)
                ])
                setPost({ results: [post] })
                setComments(comments)
            }
            catch (err) {
                console.log(err)
            }
        }
        handleMount();
    }, [id]);


    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularProfiles mobile />
                {/* Note we spread the values of our post.results object, so the values are passed in as props */}
                {/* The postPage prop tells our Post component that it is being rendered into the Posts page so that it can tailor its appearance. */}
                <Post {...post.results[0]} setPosts={setPost} postPage />
                <Container className={appStyles.Content}>
                    {currentUser ? (
                        <CommentCreateForm
                            profile_id={currentUser.profile_id}
                            profileImage={profile_image}
                            post={id}
                            setPost={setPost}
                            setComments={setComments}
                        />
                    ) : comments.results.length ? (
                        "Comments"
                    ) : null}
                    {comments.results.length ? (
                        <InfiniteScroll 
                            children={
                                comments.results.map(comment => (
                                    <Comment key={comment.id} {...comment} 
                                    setPost={setPost}
                                    setComments={setComments}
                                    />
                                ))
                            }
                            dataLength={comments.results.length}
                            loader={<Asset spinner />}
                            hasMore={!!comments.next}
                            next={() => fetchMoreData(comments, setComments)}
                        />
                    ) : currentUser ? (
                        <span>No comments yet, be the first to comment.</span>
                    ) : (
                        <span>No comments yet.</span>
                    )}

                </Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default PostPage;