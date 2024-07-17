import React, { useState, useRef } from "react";
import AuthService from "../services/AuthService";
import { isEmail } from "validator";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">
        This is not a valid email.
      </div>
    );
  }
};

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const form = useRef();
  const checkBtn = useRef();

  const handleUpdate = async () => {
    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.updateProfile({ username, email }).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
          setTimeout(() => {
            AuthService.logout();
            window.location.href = "/login"; // Redirect to login page
          }, 2500);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  const handleDelete = async () => {
    setMessage("");
    setSuccessful(false);

    AuthService.deleteaccount().then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        // Optionally log out the user after account deletion
        setTimeout(() => {
          AuthService.logout();
          window.location.href = "/login"; // Redirect to login page
        }, 2500);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <Form ref={form}>
        {!successful && (
          <div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                validations={[required, vusername]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                validations={[required, validEmail]}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
        {message && (
          <div className="form-group">
            <div
              className={
                successful ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
      </Form>
    </div>
  );
};

export default Profile;