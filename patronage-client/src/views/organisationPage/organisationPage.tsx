import React from "react";
import Header from '../../components/header/header';
import Organisation from "../../components/organisation/organisation";


const OrganisationPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < Organisation />
    </React.StrictMode>
  );
};

export default OrganisationPage;