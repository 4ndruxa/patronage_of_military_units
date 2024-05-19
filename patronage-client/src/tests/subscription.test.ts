import mock from './axiosMock';
import { createSubscription, getSubscriptionsByUser } from '../services/api/subscriptions/subscriptions';

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MOCK;

describe('Subscription Service', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should create subscription', async () => {
    const newSubscription = { fundraising_id: 1, user_id: 1 };
    const createdSubscription = { id: 1, ...newSubscription };
    mock.onPost(`${BASE_URL}/subscriptions/`).reply(200, createdSubscription);

    const response = await createSubscription(newSubscription);
    expect(response).toEqual(createdSubscription);
  });

  test('should fetch subscriptions by user ID', async () => {
    const subscriptions = [{ id: 1, fundraising_id: 1, user_id: 1 }];
    mock.onGet(`${BASE_URL}/subscriptions/by-user/1`).reply(200, subscriptions);

    const response = await getSubscriptionsByUser(1);
    expect(response).toEqual(subscriptions);
  });
});