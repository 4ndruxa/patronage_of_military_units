import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import Fundraising from "../../components/fundraising/fundraising";

const FundraisingsPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <Fundraising />
      </PageLayout>
    </React.StrictMode>
  );
};

export default FundraisingsPage;
