import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import Organizations from '../../components/organizations/organizations';
import { getOrganizations } from '../../services/api/organizations/organizations';
import { renderWithProviders } from './renderWithProviders';

jest.mock('../../services/api/organizations/organizations');

describe('Organizations', () => {
  test('7 organizations give 2 pages and page «2» shows the 7th (B3)', async () => {
    const orgs = Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      name: `Організація ${i + 1}`,
      creator_id: 1,
    }));
    jest.mocked(getOrganizations).mockResolvedValue(orgs);
    renderWithProviders(<Organizations />);

    expect(await screen.findByText('Організація 1')).toBeInTheDocument();
    expect(screen.queryByText('Організація 7')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '3' })).not.toBeInTheDocument();

    // The page item <li role="button"> owns the role; its inner link owns the click handler.
    fireEvent.click(screen.getByRole('button', { name: '2' }).firstElementChild!);

    expect(screen.getByText('Організація 7')).toBeInTheDocument();
    expect(screen.queryByText('Організація 1')).not.toBeInTheDocument();
  });
});
