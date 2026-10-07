import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import Header from '../../components/header/header';
import { logoutUser } from '../../services/api/auth/auth';
import { renderWithProviders, currentLocation, testUser } from './renderWithProviders';

jest.mock('../../services/api/auth/auth');

describe('Header', () => {
  beforeEach(() => sessionStorage.clear());

  test('guest sees «Увійти» and it leads to /login', () => {
    renderWithProviders(<Header />);
    fireEvent.click(screen.getByRole('button', { name: 'Увійти' }));
    expect(currentLocation()).toBe('/login');
  });

  test('user logs out via «Logout»: logoutUser is called and the app goes to /login', async () => {
    jest.mocked(logoutUser).mockResolvedValue(undefined);
    sessionStorage.setItem('user', JSON.stringify(testUser));
    const { store } = renderWithProviders(<Header />, { user: testUser });

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => expect(currentLocation()).toBe('/login'));
    expect(logoutUser).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.user).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
  });
});
