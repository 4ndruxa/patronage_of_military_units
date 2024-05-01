import React from "react";
import Header from '../../components/header/header';
import Organizations from "../../components/organizations/organizations";


const OrganizationsPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < Organizations />
    </React.StrictMode>
  );
};

export default OrganizationsPage;