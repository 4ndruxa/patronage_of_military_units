import axiosInstance from '../../interceptor/axiosInstance';
import { Fundraising, FundraisingCreate, FundraisingResponse } from '../../../types/FundraisingsData';
import { handleError } from '../../errorHandler';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getFundraisings = async (skip = 0, limit = 100): Promise<Fundraising[] | void> => {
  try {
    const response = await axiosInstance.get<Fundraising[]>(`${BASE_URL}/fundraisings/`, {
      params: { skip, limit }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getFundraisingById = async (fundraisingId: number): Promise<FundraisingResponse | void> => {
  try {
    const response = await axiosInstance.get<FundraisingResponse>(`${BASE_URL}/fundraisings/${fundraisingId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createFundraising = async (data: FundraisingCreate): Promise<FundraisingResponse | void> => {
  try {
    const response = await axiosInstance.post<FundraisingResponse>(`${BASE_URL}/fundraisings/`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateFundraising = async (fundraisingId: number, data: FundraisingCreate): Promise<FundraisingResponse | void> => {
  try {
    const response = await axiosInstance.patch<FundraisingResponse>(`${BASE_URL}/fundraisings/${fundraisingId}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteFundraising = async (fundraisingId: number): Promise<FundraisingResponse | void> => {
  try {
    const response = await axiosInstance.delete<FundraisingResponse>(`${BASE_URL}/fundraisings/${fundraisingId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getFundraisingsByCreator = async (creatorId: number, skip = 0, limit = 100) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/fundraisings/by-creator/${creatorId}`, {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  export const getFundraisingsByOrganization = async (organizationId: number, skip = 0, limit = 100): Promise<Fundraising[] | void> => {
    try {
      const response = await axiosInstance.get<Fundraising[]>(`${BASE_URL}/fundraisings/by-organization/${organizationId}`, {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };
  