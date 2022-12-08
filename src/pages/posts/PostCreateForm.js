import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { Image } from "react-bootstrap";

function PostCreateForm() {

    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        title: '',
        content: '',
        image: '',
    })

    const { title, content, image } = postData;

    const handleChange = (event) => {
        setPostData(
            {...postData,
            [event.target.name]: event.target.value,
            }
        )
    }

    const handleChangeImage = (event) => {
        // Here we check if there  is a file in the files array held within the event object, and if so set the value of our image prop to the URL of the image.
        // URL.createObjectURL provides a local URL to the file passed in to it. To access the image, we have to access the first item in the files array.
        if (event.target.files.length){
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    };

    //   Remember this is a controlled form, hence the value props.
    const textFields = (
        <div className="text-center">
            {/* Add your form fields here */}
            <Form.Label>Title</Form.Label>
            <Form.Control
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
            />
            <Form.Label>Content</Form.Label>
            <Form.Control
                as="textarea"
                name="content"
                rows={6}
                value={content}
                onChange={handleChange}
            />

            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => { }}
            >
                cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                create
            </Button>
        </div>
    );

    return (
        <Form>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <Form.Group className="text-center">
                            {/* Here we use a ternary to display the image if it exists, or the click to upload asset if not. */}
                            {image ? (
                                <>
                                    <figure>
                                        {/* Image is a React Bootstrap component. The rounded prop adds rounded corners. */}
                                        <Image className={appStyles.Image} src={image} rounded/>
                                    </figure>
                                    <div>
                                        <Form.Label
                                            className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                                            htmlFor="image-upload"
                                        >
                                            Change the image
                                        </Form.Label>
                                    </div>
                                </>
                            ) : (
                                <Form.Label
                                className="d-flex justify-content-center"
                                htmlFor="image-upload"
                            >
                                <Asset src={Upload} message="Click or tap to upload an image" />
                            </Form.Label>
                            )}
                            
                            {/* The value of the accept prop here ensures that users can only upload images. */}
                            <Form.File
                            id="image-upload"
                            accept="image/*"
                            onChange={handleChangeImage}
                            />

                        </Form.Group>
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

export default PostCreateForm;