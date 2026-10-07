import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import MySubscriptions from "../../components/mySubscriptions/mySubscriptions";


const MySubscriptionsPage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <MySubscriptions />
      </PageLayout>
    </React.StrictMode>
  );
};

export default MySubscriptionsPage;