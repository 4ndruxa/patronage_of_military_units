import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react';
import Fundraisings from '../../components/fundraisings/fundraisings';
import { getFundraisings, getFundraisingsByOrganization } from '../../services/api/fundraisings/fundraisings';
import { Fundraising } from '../../types/FundraisingsData';
import { renderWithProviders, currentLocation } from './renderWithProviders';

jest.mock('../../services/api/fundraisings/fundraisings');

const fundraising = (id: number): Fundraising => ({
  id,
  title: `Збір ${id}`,
  description: `Опис ${id}`,
  creator_id: 1,
  organization_id: 1,
  sources: [],
  organizations: { id: 1, name: 'Org' },
});

const list = (count: number) => Array.from({ length: count }, (_, index) => fundraising(index + 1));

describe('Fundraisings', () => {
  test('renders cards from getFundraisings and a click opens /fundraisings/:id with state', async () => {
    jest.mocked(getFundraisings).mockResolvedValue([fundraising(1), fundraising(3)]);
    renderWithProviders(<Fundraisings />);

    expect(await screen.findByText('Збір 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Збір 3'));

    expect(currentLocation()).toMatch(/^\/fundraisings\/3 /);
    expect(currentLocation()).toContain('"title":"Збір 3"');
  });

  test('a card shows the cover by id, the org badge, the description and «Детальніше», no numbers', async () => {
    jest.mocked(getFundraisings).mockResolvedValue([fundraising(4)]);
    renderWithProviders(<Fundraisings />);

    const card = (await screen.findByText('Збір 4')).closest('article') as HTMLElement;
    expect(card.querySelector('.pm-cover')).toHaveClass('pm-g5');
    expect(within(card).getByText('Org')).toHaveClass('pm-badge-org');
    expect(within(card).getByText('Опис 4')).toHaveClass('pm-desc');
    expect(within(card).getByText('Детальніше')).toBeInTheDocument();
    expect(within(card).getByRole('link', { name: 'Збір 4' })).toHaveAttribute('href', '/fundraisings/4');
    expect(card.querySelector('.pm-thermo, .pm-meta')).toBeNull();
  });

  test('the section header links to all organizations', async () => {
    jest.mocked(getFundraisings).mockResolvedValue([fundraising(1)]);
    renderWithProviders(<Fundraisings />);

    expect(await screen.findByRole('heading', { name: 'Актуальні збори' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Усі організації' }));
    expect(currentLocation()).toBe('/organizations');
  });

  test('7 fundraisings: 6 per page and pagination «1 2»', async () => {
    jest.mocked(getFundraisings).mockResolvedValue(list(7));
    renderWithProviders(<Fundraisings />);

    expect(await screen.findByText('Збір 6')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(6);
    const pages = screen.getByRole('navigation', { name: 'Сторінки зборів' });
    expect(within(pages).getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
    expect(within(pages).getByRole('button', { name: 'Попередня сторінка' })).toBeDisabled();

    fireEvent.click(within(pages).getByRole('button', { name: '2' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByText('Збір 7')).toBeInTheDocument();
    expect(within(pages).getByRole('button', { name: 'Наступна сторінка' })).toBeDisabled();
  });

  test('6 or fewer fundraisings: no pagination', async () => {
    jest.mocked(getFundraisings).mockResolvedValue(list(4));
    renderWithProviders(<Fundraisings />);

    expect(await screen.findByText('Збір 4')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Сторінки зборів' })).toBeNull();
  });

  test('no fundraisings: the empty state', async () => {
    jest.mocked(getFundraisings).mockResolvedValue([]);
    renderWithProviders(<Fundraisings />);

    expect(await screen.findByText('Зборів поки немає')).toBeInTheDocument();
    expect(screen.getByText('Зазирніть пізніше.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Повторити/ })).toBeNull();
  });

  test('a failed request: the error state, and «Повторити» repeats the same request', async () => {
    jest.mocked(getFundraisings).mockResolvedValueOnce(undefined).mockResolvedValueOnce([fundraising(2)]);
    renderWithProviders(<Fundraisings />);

    expect(await screen.findByText('Не вдалося завантажити дані')).toBeInTheDocument();
    expect(screen.getByText('Спробуйте ще раз.')).toBeInTheDocument();
    expect(screen.queryByText('Зборів поки немає')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Повторити/ }));
    expect(await screen.findByText('Збір 2')).toBeInTheDocument();
    expect(getFundraisings).toHaveBeenCalledTimes(2);
    expect(jest.mocked(getFundraisings).mock.calls).toEqual([[], []]);
  });

  test('on an organization page: that organization\'s fundraisings, no catalog header', async () => {
    jest.mocked(getFundraisingsByOrganization).mockResolvedValue([fundraising(5)]);
    renderWithProviders(<Fundraisings organizationId={9} />);

    expect(await screen.findByText('Збір 5')).toBeInTheDocument();
    expect(getFundraisingsByOrganization).toHaveBeenCalledWith(9);
    expect(getFundraisings).not.toHaveBeenCalled();
    expect(screen.queryByRole('heading', { name: 'Актуальні збори' })).toBeNull();
  });
});
