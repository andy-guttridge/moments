import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function PostEditForm() {

    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        title: '',
        content: '',
        image: '',
    })

    const { title, content, image } = postData;

    // We use this useRef hook to maintain a reference to the form file upload element. Note it has a ref prop where we give it this hook below.
    const imageInput = useRef(null);

    // We use this useHistory hook to redirect the user.
    const history = useHistory();

    // We use useParams hook to extract the  post id from the url.
    const { id } = useParams();

    // Our useEffect dependencies array contains history and id, as we want to refresh the post data when we get a new post id or the page is reloaded.
    useEffect(() => {
        const handleMount = async () => {
            try {
                //  Get the post data
                const { data } = await axiosReq.get(`/posts/${id}`);
                const { title, content, image, is_owner } = data;

                //  Check if user is the owner of the post. If so, we set the state of our component with the post data, if not redirect to the home page.
                is_owner ? setPostData({ title, content, image }) : history.push('/')
            }
            catch (err) {
                // console.log(err);
            }
        }
        handleMount();
    }, [history, id]);

    const handleChange = (event) => {
        setPostData(
            {
                ...postData,
                [event.target.name]: event.target.value,
            }
        )
    }

    const handleChangeImage = (event) => {
        // Here we check if there  is a file in the files array held within the event object, and if so set the value of our image prop to the URL of the image.
        // URL.createObjectURL provides a local URL to the file passed in to it. To access the image, we have to access the first item in the files array.
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);

        // Check if the user has uploaded a new image. If not, then the existing image stays in place, as the form  component won't have an image file.
        if (imageInput?.current?.files[0]) {
            formData.append("image", imageInput.current.files[0]);
        }

        // We have to refresh the user's access token before we make a request to create a post, because we are uploading an image file as well as text.
        try {
            await axiosReq.put(`/posts/${id}/`, formData);
            // Note our API returns some data about our newly created post. We can use this to redirect the user to a URL for the post they just edited, using the post id.
            history.push(`/posts/${id}`);
        }
        catch (err) {
            // console.log(err)
            // A 401 error will be handled by our axios interceptor, so only set the error data if its a different error.
            if (err.response?.status !== 401) {
                setErrors(err.response?.data)
            }
        }
    }

    //   Remember this is a controlled form, hence the value props.
    const textFields = (
        <div className="text-center">
            {/* Add your form fields here */}
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.title?.map((message, idx) => (
                <Alert variant="warning" key={idx}>{message}</Alert>
            ))}
            <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control
                    as="textarea"
                    name="content"
                    rows={6}
                    value={content}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors.content?.map((message, idx) => (
                <Alert variant="warning" key={idx}>{message}</Alert>
            ))}

            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => history.goBack()}
            >
                cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                save
            </Button>
        </div>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <Form.Group className="text-center">

                            <figure>
                                {/* Image is a React Bootstrap component. The rounded prop adds rounded corners. */}
                                <Image className={appStyles.Image} src={image} rounded />
                            </figure>
                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                                    htmlFor="image-upload"
                                >
                                    Change the image
                                </Form.Label>
                            </div>

                            {/* The value of the accept prop here ensures that users can only upload images. */}
                            <Form.File
                                id="image-upload"
                                accept="image/*"
                                onChange={handleChangeImage}
                                ref={imageInput}
                            />

                        </Form.Group>
                        {errors?.image?.map((message, idx) => (
                            <Alert variant="warning" key={idx}>{message}</Alert>
                        ))}
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    );
}

export default PostEditForm;