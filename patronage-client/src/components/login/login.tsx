import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import axios from 'axios';
import googleLogo from "../../assets/google-logo.svg";

const Login = () => {
  const googleRedirectURI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      const code = tokenResponse.code;
  
      axios.post('http://localhost:8000/oauth/google/callback', { code })
        .then((response) => {
          console.log("Authentication successful");
        })
        .catch((error) => {
          console.error("Authentication failed", error);
        });
    },
    onError: () => console.log('Login failed'),
    flow: 'auth-code',
    redirect_uri: googleRedirectURI,
  });

  return (
    <div className="login-container d-flex flex-column align-items-center">
      <h3 className="d-flex justify-content-center align-items-center gap-2">
        <span>Увійти з Google</span>
      </h3>
      <button onClick={() => login()} className="btn btn-primary w-25 d-flex justify-content-center align-items-center gap-2">
        <img className="logo-img-middle" src={googleLogo} />
        <span>Login with Google</span>
      </button>
    </div>
  );
};

export default Login;