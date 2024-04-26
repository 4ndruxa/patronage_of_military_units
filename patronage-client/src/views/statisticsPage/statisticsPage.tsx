import React from "react";
import Header from '../../components/header/header';
import Statistics from "../../components/statistics/statistics";


const StatisticsPage: React.FC = () => {
  return (
    <React.StrictMode>
      < Header />
      < Statistics />
    </React.StrictMode>
  );
};

export default StatisticsPage;