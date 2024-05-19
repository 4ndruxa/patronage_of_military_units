import mock from './axiosMock';
import {
  getFundraisings,
  getFundraisingById,
  createFundraising,
  updateFundraising,
  deleteFundraising,
  getFundraisingsByCreator,
  getFundraisingsByOrganization
} from '../services/api/fundraisings/fundraisings';

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MOCK;

describe('Fundraising Service', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should fetch fundraisings', async () => {
    const fundraisings = [{ id: 1, title: 'Test Fundraising' }];
    mock.onGet(`${BASE_URL}/fundraisings/`).reply(200, fundraisings);

    const response = await getFundraisings();
    expect(response).toEqual(fundraisings);
  });

  test('should fetch fundraising by ID', async () => {
    const fundraising = { id: 1, title: 'Test Fundraising' };
    mock.onGet(`${BASE_URL}/fundraisings/1`).reply(200, fundraising);

    const response = await getFundraisingById(1);
    expect(response).toEqual(fundraising);
  });

  test('should create fundraising', async () => {
    const newFundraising = { title: 'New Fundraising', creator_id: 1, organization_id: 1, sources: [] };
    const createdFundraising = { id: 1, ...newFundraising };
    mock.onPost(`${BASE_URL}/fundraisings/`).reply(200, createdFundraising);

    const response = await createFundraising(newFundraising);
    expect(response).toEqual(createdFundraising);
  });

  test('should update fundraising', async () => {
    const updatedFundraising = { title: 'Updated Fundraising', creator_id: 1, organization_id: 1, sources: [] };
    mock.onPatch(`${BASE_URL}/fundraisings/1`).reply(200, updatedFundraising);

    const response = await updateFundraising(1, updatedFundraising);
    expect(response).toEqual(updatedFundraising);
  });

  test('should delete fundraising', async () => {
    const deletedFundraising = { id: 1, title: 'Deleted Fundraising' };
    mock.onDelete(`${BASE_URL}/fundraisings/1`).reply(200, deletedFundraising);

    const response = await deleteFundraising(1);
    expect(response).toEqual(deletedFundraising);
  });

  test('should fetch fundraisings by creator', async () => {
    const fundraisings = [{ id: 1, title: 'Test Fundraising' }];
    mock.onGet(`${BASE_URL}/fundraisings/by-creator/1`).reply(200, fundraisings);

    const response = await getFundraisingsByCreator(1);
    expect(response).toEqual(fundraisings);
  });

  test('should fetch fundraisings by organization', async () => {
    const fundraisings = [{ id: 1, title: 'Test Fundraising' }];
    mock.onGet(`${BASE_URL}/fundraisings/by-organization/1`).reply(200, fundraisings);

    const response = await getFundraisingsByOrganization(1);
    expect(response).toEqual(fundraisings);
  });
});