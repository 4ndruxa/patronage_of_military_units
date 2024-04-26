import React from "react";
import Header from '../../components/header/header';
import MyOrganizations from "../../components/myOrganizations/myOrganizations";


const MyOrganizationsPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < MyOrganizations />
    </React.StrictMode>
  );
};

export default MyOrganizationsPage;