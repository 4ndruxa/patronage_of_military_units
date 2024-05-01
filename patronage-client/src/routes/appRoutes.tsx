import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../views/homePage/homePage';
import FundraisingPage from '../views/fundraisingPage/fundraisingPage';
import Secure from '../components/login/secure';
import LoginPage from '../views/loginPage/loginPage';
import MyFundraisingsPage from '../views/myFundraisingsPage/myFundraisingsPage';
import AddOrganizationPage from '../views/addEditOrganizationPage/addEditOrganizationPage';
import MyOrganizationsPage from '../views/myOrganizationsPage/myOrganizationsPage';
import MySubscriptionsPage from '../views/mySubscriptionsPage/mySubscriptionsPage';
import OrganizationsPage from '../views/organizationsPage/organizationsPage';
import StatisticsPage from '../views/statisticsPage/statisticsPage';
import OrganizationPage from '../views/organizationPage/organizationPage';
import AddEditFundraising from '../components/addEditFundraising/addEditFundraising';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/patronage_of_military_units" element={<HomePage />} />
      <Route path="/add-fundraising" element={<AddEditFundraising />} />
      <Route path="/edit-fundraising/:id" element={<AddEditFundraising />} />
      <Route path="/add-organization" element={<AddOrganizationPage />} />
      <Route path="/edit-organization/:id" element={<AddOrganizationPage />} />
      <Route path="/fundraisings/:id" element={<FundraisingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my-fundraisings" element={<MyFundraisingsPage />} />
      <Route path="/my-organizations" element={<MyOrganizationsPage />} />
      <Route path="/my-subscriptions" element={<MySubscriptionsPage />} />
      <Route path="/organizations" element={<OrganizationsPage />} />
      <Route path="/organizations/:id" element={<OrganizationPage />} />
      <Route path="/secure" element={<Secure />} />
      <Route path="/statistics" element={<StatisticsPage />} />
    </Routes>
  );
};

export default AppRoutes;
