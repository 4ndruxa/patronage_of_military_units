import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../views/homePage/homePage';
import FundraisePage from '../views/fundraisePage/fundraisePage';
import Secure from '../components/login/secure';
import LoginPage from '../views/loginPage/loginPage';
import AddFundraisePage from '../views/addFundraisePage/addFundraisePage';
import MyFundraisesPage from '../views/myFundraisesPage/myFundraisesPage';
import AddOrganizationPage from '../views/addOrganizationPage/addOrganizationPage';
import MyOrganizationsPage from '../views/myOrganizationsPage/myOrganizationsPage';
import MySubscriptionsPage from '../views/mySubscriptionsPage/mySubscriptionsPage';
import OrganisationsPage from '../views/organisationsPage/organisationsPage';
import StatisticsPage from '../views/statisticsPage/statisticsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/patronage_of_military_units" element={<HomePage />} />
      <Route path="/add-fundraise" element={<AddFundraisePage />} />
      <Route path="/add-organization" element={<AddOrganizationPage />} />
      <Route path="/fundraise/:id" element={<FundraisePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my-fundraises" element={<MyFundraisesPage />} />
      <Route path="/my-organizations" element={<MyOrganizationsPage />} />
      <Route path="/my-subscriptions" element={<MySubscriptionsPage />} />
      <Route path="/organisations" element={<OrganisationsPage />} />
      <Route path="/secure" element={<Secure />} />
      <Route path="/statistics" element={<StatisticsPage />} />
    </Routes>
  );
};

export default AppRoutes;
