import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import MySubscriptions from '../../components/mySubscriptions/mySubscriptions';
import { deleteSubscription, getSubscriptionsByUser } from '../../services/api/subscriptions/subscriptions';
import { renderWithProviders, testUser } from './renderWithProviders';

jest.mock('../../services/api/subscriptions/subscriptions');

const card = {
  id: 8,
  title: 'Підписаний збір',
  description: '',
  creator_id: 1,
  organization_id: 1,
  sources: [],
  organizations: { id: 1, name: 'Org' },
};

describe('MySubscriptions', () => {
  test('«Відписатись» calls deleteSubscription and refetches the list', async () => {
    jest.mocked(getSubscriptionsByUser).mockResolvedValueOnce([card]).mockResolvedValueOnce([]);
    jest.mocked(deleteSubscription).mockResolvedValue(undefined);
    renderWithProviders(<MySubscriptions />, { user: testUser });

    fireEvent.click(await screen.findByRole('button', { name: 'Відписатись' }));

    await waitFor(() => expect(screen.queryByText(card.title)).not.toBeInTheDocument());
    expect(deleteSubscription).toHaveBeenCalledWith(testUser.id, card.id);
    expect(getSubscriptionsByUser).toHaveBeenCalledTimes(2);
    expect(getSubscriptionsByUser).toHaveBeenLastCalledWith(testUser.id);
  });
});
