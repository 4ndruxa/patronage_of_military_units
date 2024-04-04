import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../views/homePage/homePage';
import FundraisePage from '../views/fundraisePage/fundraisePage';
import Secure from '../components/login/secure';
import LoginPage from '../views/loginPage/loginPage';
import AddFundraisePage from '../views/addFundraisePage/addFundraisePage';
import MyFundraisesPage from '../views/myFundraisesPage/myFundraisesPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/patronage_of_military_units" element={<HomePage />} />
      <Route path="/fundraise/:id" element={<FundraisePage />} />
      <Route path="/add-fundraise" element={<AddFundraisePage />} />
      <Route path="/my-fundraises" element={<MyFundraisesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/secure" element={<Secure />} />
    </Routes>
  );
};

export default AppRoutes;
