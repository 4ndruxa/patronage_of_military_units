import React from "react";
import Header from '../../components/header/header';
import AddOrganization from "../../components/addOrganization/addOrganization";


const AddOrganizationPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < AddOrganization />
    </React.StrictMode>
  );
};

export default AddOrganizationPage;