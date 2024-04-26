import React from "react";
import Header from '../../components/header/header';
import MySubscriptions from "../../components/mySubscriptions/mySubscriptions";


const MySubscriptionsPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < MySubscriptions />
    </React.StrictMode>
  );
};

export default MySubscriptionsPage;