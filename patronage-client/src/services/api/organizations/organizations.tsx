import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const getOrganizations = async (skip: number = 0, limit: number = 100) => {
  try {
    const response = await axios.get(`${BASE_URL}/organizations/`, {
      params: { skip, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrganizationById = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrganization = async (data: { name: string; description?: string }, userId: number) => {
  try {
    const response = await axios.post(`${BASE_URL}/organizations/`, { ...data, creator_id: userId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrganization = async (id: number, data: { name?: string; description?: string }) => {
  try {
    const response = await axios.patch(`${BASE_URL}/organizations/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOrganization = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
