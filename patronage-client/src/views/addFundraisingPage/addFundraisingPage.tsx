import React from "react";
import Header from '../../components/header/header';
import AddFundraisings from "../../components/addFundraising/addFundraising";

const AddFundraisingsPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < AddFundraisings />
    </React.StrictMode>
  );
};

export default AddFundraisingsPage;
