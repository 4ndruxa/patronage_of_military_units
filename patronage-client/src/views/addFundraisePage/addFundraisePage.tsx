import React from "react";
import Header from '../../components/header/header';
import AddFundraise from "../../components/addFundraise/addFundraise";

const AddFundraisePage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < AddFundraise />
    </React.StrictMode>
  );
};

export default AddFundraisePage;
