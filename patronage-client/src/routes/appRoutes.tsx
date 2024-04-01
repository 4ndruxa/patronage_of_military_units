import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../views/homePage/homePage';
import FundraisePage from '../views/fundraisePage/fundraisePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/patronage-home" element={<HomePage />} />
      <Route path="/fundraise/:id" element={<FundraisePage />} />
    </Routes>
  );
};

export default AppRoutes;
