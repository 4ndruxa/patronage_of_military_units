import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import AddEditFundraising from '../../components/addEditFundraising/addEditFundraising';
import { createFundraising } from '../../services/api/fundraisings/fundraisings';
import { getOrganizations } from '../../services/api/organizations/organizations';
import { renderWithProviders, currentLocation, testUser } from './renderWithProviders';

jest.mock('../../services/api/fundraisings/fundraisings');
jest.mock('../../services/api/organizations/organizations');

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

const fillFirstSource = () => {
  type('Назва', 'Банка');
  type('Тип', 'mono');
  type('URL', 'https://send.monobank.ua/jar/abc');
};

describe('AddEditFundraising', () => {
  beforeEach(() => {
    jest.mocked(getOrganizations).mockResolvedValue([{ id: 7, name: 'Фонд' }]);
  });

  test('«Додати ще одне джерело» appears only after the first source is filled', async () => {
    renderWithProviders(<AddEditFundraising />, { user: testUser });
    await screen.findByRole('option', { name: 'Фонд' });

    expect(screen.queryByRole('button', { name: 'Додати ще одне джерело' })).not.toBeInTheDocument();
    fillFirstSource();
    fireEvent.click(screen.getByRole('button', { name: 'Додати ще одне джерело' }));

    expect(screen.getByText('Джерело надходження коштів 2')).toBeInTheDocument();
  });

  test('submit calls createFundraising with the form fields', async () => {
    jest.mocked(createFundraising).mockResolvedValue(undefined);
    renderWithProviders(<AddEditFundraising />, { user: testUser });
    await screen.findByRole('option', { name: 'Фонд' });

    type('Назва збору', 'Дрони');
    type('Опис', 'На дрони');
    fillFirstSource();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти збір' }));

    await waitFor(() => expect(currentLocation()).toBe('/my-fundraisings'));
    expect(createFundraising).toHaveBeenCalledWith({
      title: 'Дрони',
      description: 'На дрони',
      organization_id: 7,
      sources: [{ title: 'Банка', type: 'mono', url: 'https://send.monobank.ua/jar/abc' }],
      creator_id: testUser.id,
    });
  });
});
