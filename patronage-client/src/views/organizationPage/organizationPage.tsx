import React from "react";
import Header from '../../components/header/header';
import Organization from "../../components/organization/organization";


const OrganizationPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < Organization />
    </React.StrictMode>
  );
};

export default OrganizationPage;