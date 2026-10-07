import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import AddOrganization from "../../components/addEditOrganization/addEditOrganization";


const AddOrganizationPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <AddOrganization />
      </PageLayout>
    </React.StrictMode>
  );
};

export default AddOrganizationPage;