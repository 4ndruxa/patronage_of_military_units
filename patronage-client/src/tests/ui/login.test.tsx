import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useGoogleLogin } from '@react-oauth/google';
import Login from '../../components/login/login';
import { login } from '../../services/api/auth/auth';
import { renderWithProviders } from './renderWithProviders';

jest.mock('@react-oauth/google', () => ({ useGoogleLogin: jest.fn() }));
jest.mock('../../services/api/auth/auth');

type GoogleLoginOptions = { flow: string; onSuccess: (response: { code: string }) => void };
const googleOptions = () => jest.mocked(useGoogleLogin).mock.calls[0][0] as unknown as GoogleLoginOptions;

describe('Login', () => {
  test('the Google button starts the auth-code flow from useGoogleLogin', () => {
    const startLogin = jest.fn();
    jest.mocked(useGoogleLogin).mockReturnValue(startLogin);
    renderWithProviders(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /Login with Google/ }));

    expect(startLogin).toHaveBeenCalledTimes(1);
    expect(googleOptions()).toMatchObject({ flow: 'auth-code' });
  });

  test('a successful Google response exchanges the code via login', async () => {
    jest.mocked(useGoogleLogin).mockReturnValue(jest.fn());
    jest.mocked(login).mockResolvedValue({ token: 't' });
    // jsdom does not implement navigation; silence its "Not implemented" report.
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(<Login />);

    googleOptions().onSuccess({ code: 'x' });

    await waitFor(() => expect(login).toHaveBeenCalledWith('x'));
    consoleError.mockRestore();
  });
});
