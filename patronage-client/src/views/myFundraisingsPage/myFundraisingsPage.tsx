import React from "react";
import Header from '../../components/header/header';
import MyFundraisings from "../../components/myFundraisings/myFundraisings";

const MyFundraisingsPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < MyFundraisings />
    </React.StrictMode>
  );
};

export default MyFundraisingsPage;
