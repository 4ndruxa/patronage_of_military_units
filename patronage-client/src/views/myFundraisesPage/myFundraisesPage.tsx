import React from "react";
import Header from '../../components/header/header';
import MyFundraise from "../../components/myFundraises/myFundraises";

const MyFundraisesPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < MyFundraise />
    </React.StrictMode>
  );
};

export default MyFundraisesPage;
