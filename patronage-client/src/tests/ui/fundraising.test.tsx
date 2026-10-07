import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import Fundraising from '../../components/fundraising/fundraising';
import { getFundraisingById } from '../../services/api/fundraisings/fundraisings';
import { createSubscription } from '../../services/api/subscriptions/subscriptions';
import { renderWithProviders, currentLocation, testUser } from './renderWithProviders';

jest.mock('../../services/api/fundraisings/fundraisings');
jest.mock('../../services/api/subscriptions/subscriptions');

const data = {
  id: 5,
  title: 'Дрони для бригади',
  description: 'Опис збору',
  creator_id: 1,
  organization_id: 2,
  organizations: { id: 2, name: 'Фонд' },
  sources: [{ id: 1, title: 'Банка', type: 'mono', url: 'https://send.monobank.ua/jar/abc', creator_id: 1 }],
};

const path = '/fundraisings/:id';

describe('Fundraising', () => {
  test('uses navigation state without a request', async () => {
    renderWithProviders(<Fundraising />, { path, route: { pathname: '/fundraisings/5', state: data } });

    expect(await screen.findByRole('heading', { name: data.title })).toBeInTheDocument();
    expect(getFundraisingById).not.toHaveBeenCalled();
  });

  test('without state fetches getFundraisingById by the URL id (B4)', async () => {
    jest.mocked(getFundraisingById).mockResolvedValue(data);
    renderWithProviders(<Fundraising />, { path, route: '/fundraisings/5' });

    expect(await screen.findByRole('heading', { name: data.title })).toBeInTheDocument();
    expect(getFundraisingById).toHaveBeenCalledWith(5);
  });

  test('a missing fundraising shows «Збір не знайдено» (B4)', async () => {
    jest.mocked(getFundraisingById).mockResolvedValue(undefined);
    renderWithProviders(<Fundraising />, { path, route: '/fundraisings/999' });

    expect(await screen.findByRole('heading', { name: 'Збір не знайдено' })).toBeInTheDocument();
  });

  test('a non-numeric id shows «Збір не знайдено» without a request (B4)', async () => {
    renderWithProviders(<Fundraising />, { path, route: '/fundraisings/abc' });

    expect(await screen.findByRole('heading', { name: 'Збір не знайдено' })).toBeInTheDocument();
    expect(getFundraisingById).not.toHaveBeenCalled();
  });

  test('«Підписатись» calls createSubscription with fundraising and user ids', async () => {
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: data },
      user: testUser,
    });

    fireEvent.click((await screen.findAllByRole('button', { name: 'Підписатись' }))[0]);

    await waitFor(() =>
      expect(createSubscription).toHaveBeenCalledWith({ fundraising_id: 5, user_id: testUser.id }),
    );
  });

  test('«Задонатити зараз» goes to /redirect-bank-link with the first source url', async () => {
    renderWithProviders(<Fundraising />, { path, route: { pathname: '/fundraisings/5', state: data } });

    fireEvent.click((await screen.findAllByRole('button', { name: 'Задонатити зараз' }))[0]);

    expect(currentLocation()).toBe(
      `/redirect-bank-link ${JSON.stringify({ url: data.sources[0].url })}`,
    );
  });
});
