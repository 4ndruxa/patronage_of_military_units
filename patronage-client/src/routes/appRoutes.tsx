import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../views/homePage/homePage';
import FundraisingPage from '../views/fundraisingPage/fundraisingPage';
import LoginPage from '../views/loginPage/loginPage';
import MyFundraisingsPage from '../views/myFundraisingsPage/myFundraisingsPage';
import AddOrganizationPage from '../views/addEditOrganizationPage/addEditOrganizationPage';
import MyOrganizationsPage from '../views/myOrganizationsPage/myOrganizationsPage';
import MySubscriptionsPage from '../views/mySubscriptionsPage/mySubscriptionsPage';
import OrganizationsPage from '../views/organizationsPage/organizationsPage';
import OrganizationPage from '../views/organizationPage/organizationPage';
import AddEditFundraisingPage from '../views/addEditFundraisingsPage/addFundraisingPage';
import ProtectedRoutes from '../components/routes/protectedRoutes';
import PublicRoutes from '../components/routes/publicRoutes';
import BankLinkRedirect from '../components/mySubscriptions/bankLinkRedirect';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/patronage_of_military_units" element={<HomePage />} />
      <Route
        path="/add-fundraising"
        element={
          <ProtectedRoutes>
            <AddEditFundraisingPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/edit-fundraising/:id"
        element={
          <ProtectedRoutes>
            <AddEditFundraisingPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/add-organization"
        element={
          <ProtectedRoutes>
            <AddOrganizationPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/edit-organization/:id"
        element={
          <ProtectedRoutes>
            <AddOrganizationPage />
          </ProtectedRoutes>
        }
      />
      <Route path="/fundraisings/:id" element={<FundraisingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoutes>
            <LoginPage />
          </PublicRoutes>
        }
      />
      <Route
        path="/my-fundraisings"
        element={
          <ProtectedRoutes>
            <MyFundraisingsPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/my-organizations"
        element={
          <ProtectedRoutes>
            <MyOrganizationsPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/my-subscriptions"
        element={
          <ProtectedRoutes>
            <MySubscriptionsPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/redirect-bank-link"
        element={
          <ProtectedRoutes>
            <BankLinkRedirect />
          </ProtectedRoutes>
        }
      />
      <Route path="/organizations" element={<OrganizationsPage />} />
      <Route path="/organizations/:id" element={<OrganizationPage />} />
    </Routes>
  );
};

export default AppRoutes;