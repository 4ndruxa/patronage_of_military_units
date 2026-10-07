import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import MyOrganizations from "../../components/myOrganizations/myOrganizations";


const MyOrganizationsPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <MyOrganizations />
      </PageLayout>
    </React.StrictMode>
  );
};

export default MyOrganizationsPage;