import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { login } from '../../services/api/auth/auth';
import googleLogo from "../../assets/google-logo.svg";

const Login = () => {
  const googleRedirectURI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const loginWithGoogle = useGoogleLogin({
    onSuccess: tokenResponse => {
      const code = tokenResponse.code;
  
      login(code)
        .then((response) => {
          Cookies.set('access_token', response.token, { expires: 1 });
          window. location. reload();
        })
        .catch((error) => {
          console.error("Authentication failed", error);
        });
    },
    onError: () => console.error('Login failed'),
    flow: 'auth-code',
    redirect_uri: googleRedirectURI,
  });

  return (
    <div className="login-container d-flex flex-column align-items-center">
      <h3 className="d-flex justify-content-center align-items-center gap-2">
        <span>Увійти з Google</span>
      </h3>
      <button onClick={() => loginWithGoogle()} className="btn btn-primary w-25 d-flex justify-content-center align-items-center gap-2">
        <img className="logo-img-middle" src={googleLogo} />
        <span>Login with Google</span>
      </button>
    </div>
  );
};

export default Login;