import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import MyFundraisings from "../../components/myFundraisings/myFundraisings";

const MyFundraisingsPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <MyFundraisings />
      </PageLayout>
    </React.StrictMode>
  );
};

export default MyFundraisingsPage;
