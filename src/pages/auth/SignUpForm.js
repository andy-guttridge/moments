import React, {useState} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { Form, Button, Image, Col, Row, Container, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const SignUpForm = () => {
    
    const [signUpData, setSignUpData] = useState({
        username: '',
        password1: '',
        password2: ''
    });
    const { username, password1, password2 } = signUpData;
    const [errors,  setErrors] = useState({});
    const history = useHistory();

    const handleChange = (event) => {
        setSignUpData({
            // Note we use the spread operator to ensure all the existing values are set first
            ...signUpData,
            // Then we use a computed property to set the value of the relevant property, based on the form input element names
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        // preventDefault stops the page from refreshing
        event.preventDefault();
        try {
            await axios.post('/dj-rest-auth/registration/', signUpData);
            history.push('/signin');
        }
        catch(err){
            // The question mark is an 'optional chain'. JS checks for the data so that we don't get an error if it doesn't exist.
            setErrors(err.response?.data);
            console.log(err.response.data)
        }
    }

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>sign up</h1>
            <Form  onSubmit={handleSubmit}>
                {/* In React Bootstrap, the controlId prop defines both the for and id attributes to link labels with form elements */}
                <Form.Group controlId="username">
                    {/* We hide the label with d-none, but it is still there for screen readers */}
                    <Form.Label className="d-none">Username</Form.Label>
                    <Form.Control
                        className={styles.Input}
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={handleChange}
                    />
                </Form.Group>
                {/* Here we use optional chaining to check if there are any errors with a key of 'username' in the errors object before we attempt to use map on them */}
                {errors.username?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>{message}</Alert>
                ))}

                <Form.Group controlId="password1">
                    <Form.Label className="d-none">Password</Form.Label>
                    <Form.Control
                        // Note the value attribute - this is a controlled form.
                        className={styles.Input}
                        type="password"
                        placeholder="Password"
                        name="password1"
                        value={password1}
                        onChange={handleChange}
                    />
                </Form.Group>
                
                {errors.password1?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>{message}</Alert>
                ))}

                <Form.Group controlId="password2">
                    <Form.Label className="d-none">Confirm password</Form.Label>
                    <Form.Control
                        className={styles.Input}
                        type="password"
                        placeholder="Confirm password"
                        name="password2"
                        value={password2}
                        onChange={handleChange}
                    />
                </Form.Group>

                {errors.password2?.map((message, idx) => (
                    <Alert variant="warning" key={idx}>{message}</Alert>
                ))}

                <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} type="submit">
                    Sign-up
                </Button>
            </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
      >
        <Image
          className={`${appStyles.FillerImage}`}
          src={
            "https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero2.jpg"
          }
        />
      </Col>
    </Row>
  );
};

export default SignUpForm;