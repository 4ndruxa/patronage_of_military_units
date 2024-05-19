import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import AppRoutes from './routes/appRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from './store';
import ErrorAlert from './components/error/errorAlert';
import AlertComponent from './components/notificationDonate/notificationAlert';

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
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId || ''}>
        <Router>
          <ErrorAlert />
          <AppRoutes />
          <AlertComponent />
        </Router>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();