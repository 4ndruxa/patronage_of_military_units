import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import Organization from "../../components/organization/organization";


const OrganizationPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <Organization />
      </PageLayout>
    </React.StrictMode>
  );
};

export default OrganizationPage;