import React from "react";
import Header from '../../components/header/header';
import Organisations from "../../components/organisations/organisations";


const OrganisationsPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < Organisations />
    </React.StrictMode>
  );
};

export default OrganisationsPage;