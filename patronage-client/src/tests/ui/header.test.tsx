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

  test('user logs out via «Вийти» in the avatar menu: logoutUser is called and the app goes to /login', async () => {
    jest.mocked(logoutUser).mockResolvedValue(undefined);
    sessionStorage.setItem('user', JSON.stringify(testUser));
    const { store } = renderWithProviders(<Header />, { user: testUser });

    fireEvent.click(screen.getByRole('button', { name: /Меню користувача/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Вийти' }));

    await waitFor(() => expect(currentLocation()).toBe('/login'));
    expect(logoutUser).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.user).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
  });

  test('a signed-in user gets a bell link to «Мої підписки» next to the theme toggle', () => {
    renderWithProviders(<Header />, { user: testUser });

    const bell = screen.getAllByRole('link', { name: 'Мої підписки' }).find((link) => link.classList.contains('pm-bellbtn'));
    expect(bell).toBeDefined();
    fireEvent.click(bell!);
    expect(currentLocation()).toBe('/my-subscriptions');
  });

  test('a guest has no bell', () => {
    renderWithProviders(<Header />);
    expect(screen.queryByRole('link', { name: 'Мої підписки' })).not.toBeInTheDocument();
  });
});
