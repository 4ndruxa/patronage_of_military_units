import React from "react";
import Header from '../../components/header/header';
import AddOrganization from "../../components/addEditOrganization/addEditOrganization";


const AddOrganizationPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < AddOrganization />
    </React.StrictMode>
  );
};

export default AddOrganizationPage;