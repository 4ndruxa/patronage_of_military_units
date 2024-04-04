import React from "react";
import Header from '../../components/header/header';
import Login from "../../components/login/login";

const LoginPage: React.FC = () => {
  return (
    <React.StrictMode>
      <Header />
      <Login />
    </React.StrictMode>
  );
};

export default LoginPage;
