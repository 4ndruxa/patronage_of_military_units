import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import axios from 'axios';

const Login = () => {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse);
      // const token = tokenResponse.access_token;
      // Cookies.set('access_token', token, { expires: 1, secure: true });
      const code = tokenResponse.code;
  
    // Send the code to the backend
    axios.post('http://localhost:8000/oauth/google/callback', { code })
      .then((response) => {
        // If the backend returns a success response, your cookies should already be set
        // Alternatively, handle the response data as needed
        console.log("Authentication successful");
      })
      .catch((error) => {
        console.error("Authentication failed", error);
      });
    },
    onError: () => console.log('Login failed'),
    flow: 'auth-code',
  });

  return (
    <div className="login-container d-flex flex-column align-items-center">
      <h1>Увійти з Google</h1>
      <button onClick={() => login()} className="btn btn-primary w-25">
        Login with Google
      </button>
    </div>
  );
};

export default Login;