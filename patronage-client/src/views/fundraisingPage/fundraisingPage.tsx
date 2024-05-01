import React from "react";
import Header from '../../components/header/header';
import Fundraising from "../../components/fundraising/fundraising";

const FundraisingsPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < Fundraising />
    </React.StrictMode>
  );
};

export default FundraisingsPage;
