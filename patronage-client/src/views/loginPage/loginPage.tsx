import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import Login from "../../components/login/login";

const LoginPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <Login />
      </PageLayout>
    </React.StrictMode>
  );
};

export default LoginPage;
