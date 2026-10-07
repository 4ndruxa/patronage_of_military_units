import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import AddFundraisings from "../../components/addEditFundraising/addEditFundraising";

const AddFundraisingsPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <AddFundraisings />
      </PageLayout>
    </React.StrictMode>
  );
};

export default AddFundraisingsPage;
