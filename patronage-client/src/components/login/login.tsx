import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
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