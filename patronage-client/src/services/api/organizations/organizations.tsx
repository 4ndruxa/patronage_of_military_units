import { handleError } from '../../errorHandler';
import axiosInstance from '../../interceptor/axiosInstance';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getOrganizations = async (skip: number = 0, limit: number = 100) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/organizations/`, {
      params: { skip, limit }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getOrganizationById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/organizations/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createOrganization = async (data: { name: string; description?: string }, userId: number) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/organizations/`, { ...data, creator_id: userId });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateOrganization = async (id: number, data: { name?: string; description?: string }) => {
  try {
    const response = await axiosInstance.patch(`${BASE_URL}/organizations/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteOrganization = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/organizations/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getOrganizationsByCreatorId = async (creatorId: number, skip = 0, limit = 100) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/organizations/by-creator/${creatorId}`, {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };
  