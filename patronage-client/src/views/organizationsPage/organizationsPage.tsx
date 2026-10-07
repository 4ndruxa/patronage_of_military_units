import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import Organizations from "../../components/organizations/organizations";


const OrganizationsPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <Organizations />
      </PageLayout>
    </React.StrictMode>
  );
};

export default OrganizationsPage;