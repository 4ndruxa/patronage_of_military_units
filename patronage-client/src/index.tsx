import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import './index.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import reportWebVitals from './reportWebVitals';
import AppRoutes from './routes/appRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found in the document.');
}

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
if (!googleClientId) {
  console.error('Google Client ID is not set.');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <Router>
        <AppRoutes />
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
