import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import AddEditOrganization from '../../components/addEditOrganization/addEditOrganization';
import { createOrganization } from '../../services/api/organizations/organizations';
import { renderWithProviders, currentLocation, testUser } from './renderWithProviders';

jest.mock('../../services/api/organizations/organizations');

describe('AddEditOrganization', () => {
  test('submit calls createOrganization with the form and the user id', async () => {
    jest.mocked(createOrganization).mockResolvedValue({ id: 1 });
    renderWithProviders(<AddEditOrganization />, { user: testUser });

    fireEvent.change(screen.getByLabelText("Ім'я"), { target: { value: 'Фонд' } });
    fireEvent.change(screen.getByLabelText('Опис'), { target: { value: 'Допомога' } });
    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));

    await waitFor(() => expect(currentLocation()).toBe('/organizations'));
    expect(createOrganization).toHaveBeenCalledWith(
      { name: 'Фонд', description: 'Допомога' },
      testUser.id,
    );
  });
});
