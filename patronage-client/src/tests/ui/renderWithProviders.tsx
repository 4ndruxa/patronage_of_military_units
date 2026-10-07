import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, MemoryRouterProps, Route, Routes, useLocation } from 'react-router-dom';

type InitialEntry = NonNullable<MemoryRouterProps['initialEntries']>[number];
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import errorReducer from '../../store/errorSlice';
import { errorMiddleware } from '../../store/middleware/errorMiddleware';

export const testUser = { id: 42, name: 'Test User', email: 'test@example.com' };

type AuthUser = typeof testUser | null;

// The same reducers and middleware as src/store/store.tsx, but a fresh instance
// per test so auth state never leaks between tests. A settled status keeps
// useAuth from firing a real /me request.
const makeStore = (user: AuthUser) =>
  configureStore({
    reducer: { auth: authReducer, error: errorReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(errorMiddleware),
    preloadedState: {
      auth: { user, status: user ? ('succeeded' as const) : ('failed' as const) },
      error: { message: null },
    },
  });

// Prints where the router currently is, so tests can assert navigation
// without mocking useNavigate.
const LocationProbe: React.FC = () => {
  const location = useLocation();
  return (
    <output aria-label="current location">
      {location.pathname}
      {location.state ? ` ${JSON.stringify(location.state)}` : ''}
    </output>
  );
};

interface Options {
  user?: AuthUser;
  path?: string;
  route?: InitialEntry;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  { user = null, path = '/', route = path }: Options = {},
) => {
  const store = makeStore(user);
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          <Route path="*" element={null} />
        </Routes>
        <LocationProbe />
      </MemoryRouter>
    </Provider>,
  );
  return { store, ...result };
};

export const currentLocation = () =>
  screen.getByRole('status', { name: 'current location' }).textContent;
