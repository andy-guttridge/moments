import React from 'react'
import { Card, Media, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import styles from "../../styles/Post.module.css"
import Avatar from "../../components/Avatar"
import { axiosRes } from '../../api/axiosDefaults';
import { MoreDropdown } from '../../components/MoreDropdown';

const Post = (props) => {
    // Here we destructure all the props from our Post passed in from the parent component.
    const {
        id,
        owner,
        profile_id,
        profile_image,
        comments_count,
        likes_count,
        like_id,
        title,
        content,
        image,
        updated_at,
        postPage,
        setPosts,
    } = props;

    // Find out if the user is authenticated using the useCurrentUser custom hook.
    const currentUser = useCurrentUser();
    // Find out if the current user is the owner of the post.
    const is_owner = currentUser?.username === owner;

    const history = useHistory();

    const handleEdit = () => {
        history.push(`/posts/${id}/edit`)
    }

    const handleDelete = async () =>{
        try  {
            await axiosRes.delete(`/posts/${id}/`);
            history.goBack()
        }
        catch(err) {
            // console.log(err);
        }
    }

    const handleLike = async () => {
        try {
            // Ask the API to create a new like assoicated with this post.
            const {data} = await axiosRes.post('/likes/', {post:id});
            // Here we use the setPosts function passed in as a prop to update the post data.
            // We map through all the posts in prevPosts, and if there is a like matching the post, then we increase the likes count and add the like id. If not, we return the post as is.
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? {...post, likes_count: post.likes_count + 1, like_id: data.id}
                    : post;
                })
            }))
        }
        catch(err) {
            // console.log(err);
        }
    }

    const handleUnLike = async () => {
        try {
            // Ask the  API to delete the like
            const {data} = await axiosRes.delete(`/likes/${like_id}/`);
            // Here we use the setPosts function passed in as a prop to update the post data.
            // We map through all the posts in prevPosts, and if there is a like matching the post, then we decrease the likes count and make the like id null. If not, we return the post as is.
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                    ? {...post, likes_count: post.likes_count - 1, like_id: null}
                    : post;
                })
            }))
        }
        catch(err) {
            // console.log(err);
        }
    }

    return (
        <Card className={styles.Post}>
            <Card.Body>
                <Media className="align-items-center justify-content-between">
                    <Link to={`/profiles/${profile_id}`}>
                        <Avatar src={profile_image} height={55} />
                        {owner}
                    </Link>
                    <div className='d-flex align-items-center'>
                        <span>{updated_at}</span>
                        {/* If this post is being rendered into the Posts page and the user is the post owner, then render edit and delete options */}
                        {is_owner && postPage && <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />}
                    </div>
                </Media>
            </Card.Body>
            <Link to={`/posts/${id}`}>
                <Card.Img src={image} alt={title} />
            </Link>
            <Card.Body>
                {/* Check we have values for title and content, and render if so. */}
                {title && <Card.Title className="text-center">{title}</Card.Title>}
                {content && <Card.Text>{content}</Card.Text>}
                <div className={styles.PostBar}>
                    {/* If user is the owner of the post, use Bootstrap overlay to tell them they can't like their own post */}
                    {is_owner ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>You can't like your own post!</Tooltip>}>
                            <i className="far fa-heart" />
                        </OverlayTrigger>
                        // Show a button with a filled in heart if the post has already been liked by this user.
                    ) : like_id ? (
                        <span onClick={handleUnLike}>
                            <i className={`fas fa-heart ${styles.Heart}`} />
                        </span>
                        // If the user is logged in then give them an outline heart icon to like the post with, or if not let them know they need to be logged in to like a post.
                    ) : currentUser ? (
                        <span onClick={handleLike}>
                            <i className={`far fa-heart ${styles.HeartOutline}`} />
                        </span>
                    ) : (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Log in to like posts!</Tooltip>}>
                            <i className="far fa-heart" />
                        </OverlayTrigger>
                    )}
                    {likes_count}
                    <Link to={`/posts/${id}`}>
                        <i className="far fa-comments" />
                    </Link>
                    {comments_count}
                </div>
            </Card.Body>
        </Card>
    )
}

export default Post