import React, { useState, useRef, useEffect } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../services/AuthService";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// const required = (value) => {
//     if (!value) {
//       return (
//         <div className="invalid-feedback d-block">
//           This field is required!
//         </div>
//       );
//     }
//   };
  
  const validEmail = (value) => {
    if (!isEmail(value)) {
      return (
        <div className="invalid-feedback d-block">
          This is not a valid email.
        </div>
      );
    }
  };
  
  const vusername = (value) => {
    if (value.length < 3 || value.length > 20) {
      return (
        <div className="invalid-feedback d-block">
          The username must be between 3 and 20 characters.
        </div>
      );
    }
  };
  
  const vpassword = (value) => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className="invalid-feedback d-block">
          The password must be between 6 and 40 characters.
        </div>
      );
    }
  };
  
  
  const Register = (props) => {
    const form = useRef();
    const checkBtn = useRef();
  
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
  
    const onChangeUsername = (e) => {
      const username = e.target.value;
      setUsername(username);
    };
  
    const onChangeEmail = (e) => {
      const email = e.target.value;
      setEmail(email);
    };
  
    const onChangePassword = (e) => {
      const password = e.target.value;
      setPassword(password);
    };
  
    //google-----------------------------------------------
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);
  
  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });
  
  useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                    AuthService.register(res.data.name, res.data.email, res.data.id).then(
                      (response) => {
                        setMessage(response.data.message);
                        setSuccessful(true);
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
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );
  
  // log out function to log the user out of google and set the profile array to null
  // const logOut = () => {
  //     googleLogout();
  //     setProfile(null);
  // };
  //------------------------------------------------------
  
    const handleRegister = (e) => {
      e.preventDefault();
  
      setMessage("");
      setSuccessful(false);
  
      form.current.validateAll();
  
      if (checkBtn.current.context._errors.length === 0) {
        AuthService.register(username, email, password).then(
          (response) => {
            setMessage(response.data.message);
            setSuccessful(true);
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
  
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
  
          <Form onSubmit={handleRegister} ref={form}>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    id="username"
                    value={username}
                    onChange={onChangeUsername}
                    validations={[vusername]}
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    id="email"
                    value={email}
                    onChange={onChangeEmail}
                    validations={[validEmail]}
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    value={password}
                    onChange={onChangePassword}
                    validations={[vpassword]}
                  />
                </div>
  
                <div className="form-group">
                  <button className="btn btn-primary btn-block">Sign Up</button>
                  <button onClick={login} className="btn btn-primary btn-block">Google 🚀</button>
                </div>
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
      </div>
    );
  };
  
  export default Register;

  