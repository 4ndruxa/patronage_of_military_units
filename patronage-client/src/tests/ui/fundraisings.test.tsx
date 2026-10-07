import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import Fundraisings from '../../components/fundraisings/fundraisings';
import { getFundraisings } from '../../services/api/fundraisings/fundraisings';
import { Fundraising } from '../../types/FundraisingsData';
import { renderWithProviders, currentLocation } from './renderWithProviders';

jest.mock('../../services/api/fundraisings/fundraisings');

const fundraising = (id: number): Fundraising => ({
  id,
  title: `Збір ${id}`,
  description: '',
  creator_id: 1,
  organization_id: 1,
  sources: [],
  organizations: { id: 1, name: 'Org' },
});

describe('Fundraisings', () => {
  test('renders cards from getFundraisings and a click opens /fundraisings/:id', async () => {
    jest.mocked(getFundraisings).mockResolvedValue([fundraising(1), fundraising(3)]);
    renderWithProviders(<Fundraisings />);

    expect(await screen.findByText('Збір 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Збір 3'));

    expect(currentLocation()).toMatch(/^\/fundraisings\/3 /);
  });
});
