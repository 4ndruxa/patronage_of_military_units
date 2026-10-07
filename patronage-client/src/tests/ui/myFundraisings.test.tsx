import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import MyFundraisings from '../../components/myFundraisings/myFundraisings';
import { deleteFundraising, getFundraisingsByCreator } from '../../services/api/fundraisings/fundraisings';
import { renderWithProviders, testUser } from './renderWithProviders';

jest.mock('../../services/api/fundraisings/fundraisings');

const card = {
  id: 11,
  title: 'Мій збір',
  description: '',
  creator_id: testUser.id,
  organization_id: 1,
  sources: [],
  organizations: { id: 1, name: 'Org' },
};

describe('MyFundraisings', () => {
  test('requests fundraisings of the current user, not id 1 (B2)', async () => {
    jest.mocked(getFundraisingsByCreator).mockResolvedValue([card]);
    renderWithProviders(<MyFundraisings />, { user: testUser });

    expect(await screen.findByText(card.title)).toBeInTheDocument();
    expect(getFundraisingsByCreator).toHaveBeenCalledWith(testUser.id);
    expect(getFundraisingsByCreator).not.toHaveBeenCalledWith(1);
  });

  test('«Видалити» calls deleteFundraising and removes the card', async () => {
    jest.mocked(getFundraisingsByCreator).mockResolvedValue([card]);
    jest.mocked(deleteFundraising).mockResolvedValue(card);
    renderWithProviders(<MyFundraisings />, { user: testUser });

    fireEvent.click(await screen.findByRole('button', { name: 'Видалити' }));

    await waitFor(() => expect(screen.queryByText(card.title)).not.toBeInTheDocument());
    expect(deleteFundraising).toHaveBeenCalledWith(card.id);
  });
});
