import React from 'react';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
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

// The mobile action bar repeats the actions; jsdom ignores media queries, so
// queries are scoped to the action panel.
const panel = async () => within(await screen.findByRole('complementary', { name: 'Підтримати збір' }));
const actionBar = async () => within(await screen.findByRole('group', { name: 'Швидкі дії' }));

const subscription = { id: 1, fundraising_id: 5, user_id: testUser.id } as never;

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

  test('«Підписатись на щомісячне нагадування» calls createSubscription with fundraising and user ids', async () => {
    jest.mocked(createSubscription).mockResolvedValue({ id: 1, fundraising_id: 5, user_id: testUser.id } as never);
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: data },
      user: testUser,
    });

    fireEvent.click((await panel()).getByRole('button', { name: 'Підписатись на щомісячне нагадування' }));

    await waitFor(() =>
      expect(createSubscription).toHaveBeenCalledWith({ fundraising_id: 5, user_id: testUser.id }),
    );
  });

  test('while subscribing the button is disabled, then «Ви підписані на цей збір» and a success toast', async () => {
    let resolve: (value: unknown) => void = () => {};
    jest.mocked(createSubscription).mockReturnValue(new Promise((r) => { resolve = r; }) as never);
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: data },
      user: testUser,
    });

    const button = (await panel()).getByRole('button', { name: 'Підписатись на щомісячне нагадування' });
    fireEvent.click(button);
    expect(button).toBeDisabled();

    await act(async () => { resolve({ id: 1, fundraising_id: 5, user_id: testUser.id }); });

    expect(await screen.findByText('Ви підписані на цей збір')).toBeInTheDocument();
    expect(screen.getByText('Підписку оформлено')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Підписатись/ })).not.toBeInTheDocument();
  });

  test('a failed subscription (service resolves undefined) re-enables the button', async () => {
    jest.mocked(createSubscription).mockResolvedValue(undefined);
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: data },
      user: testUser,
    });

    const button = (await panel()).getByRole('button', { name: 'Підписатись на щомісячне нагадування' });
    fireEvent.click(button);

    await waitFor(() => expect(button).toBeEnabled());
    expect(createSubscription).toHaveBeenCalled();
    expect(screen.queryByText('Ви підписані на цей збір')).not.toBeInTheDocument();
  });

  test('a guest sees «Увійти, щоб підписатись» leading to /login', async () => {
    renderWithProviders(<Fundraising />, { path, route: { pathname: '/fundraisings/5', state: data } });

    const link = (await panel()).getByRole('link', { name: 'Увійти, щоб підписатись' });
    expect(link).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /Підписатись/ })).not.toBeInTheDocument();

    fireEvent.click(link);
    expect(currentLocation()).toBe('/login');
  });

  test('«Задонатити» is a new-tab link to the first source, with a caption', async () => {
    renderWithProviders(<Fundraising />, { path, route: { pathname: '/fundraisings/5', state: data } });

    const donate = (await panel()).getByRole('link', { name: /^Задонатити/ });

    expect(donate).toHaveAttribute('href', data.sources[0].url);
    expect(donate).toHaveAttribute('target', '_blank');
    expect(donate).toHaveAttribute('rel', 'noopener noreferrer');
    expect(donate).toHaveAccessibleName(/відкриється в новій вкладці/);
    expect(screen.getByText('Сторінка оплати відкриється в новій вкладці. Суму ви обираєте самі.')).toBeInTheDocument();
  });

  test('without sources «Задонатити» is disabled with a caption', async () => {
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: { ...data, sources: [] } },
    });

    expect((await panel()).getByRole('button', { name: 'Задонатити' })).toBeDisabled();
    expect(screen.getByText('Організація ще не додала способи оплати')).toBeInTheDocument();
  });

  test('sources are listed; only http(s) urls become new-tab links', async () => {
    const sources = [
      data.sources[0],
      { id: 2, title: 'Підозріле', type: 'other', url: 'javascript:alert(1)', creator_id: 1 },
    ];
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: { ...data, sources } },
    });

    const link = await screen.findByRole('link', { name: /Банка/ });
    expect(link).toHaveAttribute('href', data.sources[0].url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Підозріле')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Підозріле/ })).not.toBeInTheDocument();
  });

  test('a javascript: url as the first source disables both «Задонатити»', async () => {
    const sources = [{ id: 2, title: 'Підозріле', type: 'other', url: 'javascript:alert(1)', creator_id: 1 }];
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: { ...data, sources } },
    });

    expect((await panel()).getByRole('button', { name: 'Задонатити' })).toBeDisabled();
    expect((await actionBar()).getByRole('button', { name: 'Задонатити' })).toBeDisabled();
  });

  test('a later web source is used when the first one is not a web url', async () => {
    const sources = [
      { id: 2, title: 'Підозріле', type: 'other', url: 'javascript:alert(1)', creator_id: 1 },
      data.sources[0],
    ];
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: { ...data, sources } },
    });

    expect((await actionBar()).getByRole('link', { name: /^Задонатити/ })).toHaveAttribute(
      'href',
      data.sources[0].url,
    );
  });

  test('action bar: «Задонатити» is disabled without sources', async () => {
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: { ...data, sources: [] } },
    });

    expect((await actionBar()).getByRole('button', { name: 'Задонатити' })).toBeDisabled();
  });

  test('action bar: «Підписатись» calls createSubscription', async () => {
    jest.mocked(createSubscription).mockResolvedValue(subscription);
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: data },
      user: testUser,
    });

    fireEvent.click((await actionBar()).getByRole('button', { name: 'Підписатись' }));

    await waitFor(() =>
      expect(createSubscription).toHaveBeenCalledWith({ fundraising_id: 5, user_id: testUser.id }),
    );
    expect(await screen.findByText('Ви підписані на цей збір')).toBeInTheDocument();
  });

  test('action bar: a guest sees the login link', async () => {
    renderWithProviders(<Fundraising />, { path, route: { pathname: '/fundraisings/5', state: data } });

    expect((await actionBar()).getByRole('link', { name: 'Увійти, щоб підписатись' })).toHaveAttribute('href', '/login');
  });

  test('success toast hides on «Закрити»', async () => {
    jest.mocked(createSubscription).mockResolvedValue(subscription);
    renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: data },
      user: testUser,
    });

    fireEvent.click((await panel()).getByRole('button', { name: 'Підписатись на щомісячне нагадування' }));
    expect(await screen.findByText('Підписку оформлено')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Закрити' }));
    expect(screen.queryByText('Підписку оформлено')).not.toBeInTheDocument();
  });

  test('success toast hides by itself after 5 s', async () => {
    jest.useFakeTimers();
    try {
      jest.mocked(createSubscription).mockResolvedValue(subscription);
      renderWithProviders(<Fundraising />, {
        path,
        route: { pathname: '/fundraisings/5', state: data },
        user: testUser,
      });

      fireEvent.click(screen.getByRole('button', { name: 'Підписатись на щомісячне нагадування' }));
      await act(() => Promise.resolve());
      expect(screen.getByText('Підписку оформлено')).toBeInTheDocument();

      act(() => { jest.advanceTimersByTime(4999); });
      expect(screen.getByText('Підписку оформлено')).toBeInTheDocument();
      act(() => { jest.advanceTimersByTime(1); });
      expect(screen.queryByText('Підписку оформлено')).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  test('body gets pm-has-actionbar while the page is shown and loses it on unmount', async () => {
    const { unmount } = renderWithProviders(<Fundraising />, {
      path,
      route: { pathname: '/fundraisings/5', state: data },
    });

    await screen.findByRole('heading', { name: data.title });
    expect(document.body).toHaveClass('pm-has-actionbar');
    unmount();
    expect(document.body).not.toHaveClass('pm-has-actionbar');
  });
});
