import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
    onError: () => console.log('Login failed'),
    flow: 'auth-code',
  });

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <button onClick={() => login()} className="btn btn-primary">
        Login with Google
      </button>
    </div>
  );
};

export default Login;

