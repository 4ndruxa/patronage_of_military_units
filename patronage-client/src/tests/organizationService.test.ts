import mock from './axiosMock';
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationsByCreatorId
} from '../services/api/organizations/organizations';

const BASE_URL = process.env.REACT_APP_API_BASE_URL_MOCK;

describe('Organization Service', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should fetch organizations', async () => {
    const organizations = [{ id: 1, name: 'Test Organization' }];
    mock.onGet(`${BASE_URL}/organizations/`).reply(200, organizations);

    const response = await getOrganizations();
    expect(response).toEqual(organizations);
  });

  test('should fetch organization by ID', async () => {
    const organization = { id: 1, name: 'Test Organization' };
    mock.onGet(`${BASE_URL}/organizations/1`).reply(200, organization);

    const response = await getOrganizationById(1);
    expect(response).toEqual(organization);
  });

  test('should create organization', async () => {
    const newOrganization = { name: 'New Organization', description: 'Description', creator_id: 1 };
    const createdOrganization = { id: 1, ...newOrganization };
    mock.onPost(`${BASE_URL}/organizations/`).reply(200, createdOrganization);

    const response = await createOrganization(newOrganization, 1);
    expect(response).toEqual(createdOrganization);
  });

  test('should update organization', async () => {
    const updatedOrganization = { name: 'Updated Organization', description: 'Updated Description' };
    mock.onPatch(`${BASE_URL}/organizations/1`).reply(200, updatedOrganization);

    const response = await updateOrganization(1, updatedOrganization);
    expect(response).toEqual(updatedOrganization);
  });

  test('should delete organization', async () => {
    const deletedOrganization = { id: 1, name: 'Deleted Organization' };
    mock.onDelete(`${BASE_URL}/organizations/1`).reply(200, deletedOrganization);

    const response = await deleteOrganization(1);
    expect(response).toEqual(deletedOrganization);
  });

  test('should fetch organizations by creator ID', async () => {
    const organizations = [{ id: 1, name: 'Test Organization' }];
    mock.onGet(`${BASE_URL}/organizations/by-creator/1`).reply(200, organizations);

    const response = await getOrganizationsByCreatorId(1);
    expect(response).toEqual(organizations);
  });
});