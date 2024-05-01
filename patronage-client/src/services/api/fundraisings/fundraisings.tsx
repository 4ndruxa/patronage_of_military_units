import axios from 'axios';
import { Fundraising, FundraisingCreate, FundraisingResponse } from '../../../types/FundraisingsData';

const BASE_URL = 'http://localhost:8000';

export const getFundraisings = async (skip = 0, limit = 100): Promise<Fundraising[]> => {
  try {
    const response = await axios.get<Fundraising[]>(`${BASE_URL}/fundraisings/`, {
      params: { skip, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFundraisingById = async (fundraisingId: number): Promise<FundraisingResponse> => {
  try {
    const response = await axios.get<FundraisingResponse>(`${BASE_URL}/fundraisings/${fundraisingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createFundraising = async (data: FundraisingCreate): Promise<FundraisingResponse> => {
  try {
    const response = await axios.post<FundraisingResponse>(`${BASE_URL}/fundraisings/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFundraising = async (fundraisingId: number, data: FundraisingCreate): Promise<FundraisingResponse> => {
  try {
    const response = await axios.patch<FundraisingResponse>(`${BASE_URL}/fundraisings/${fundraisingId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFundraising = async (fundraisingId: number): Promise<FundraisingResponse> => {
  try {
    const response = await axios.delete<FundraisingResponse>(`${BASE_URL}/fundraisings/${fundraisingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFundraisingsByCreator = async (creatorId: number, skip = 0, limit = 100) => {
    try {
      const response = await axios.get(`${BASE_URL}/fundraisings/by-creator/${creatorId}`, {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getFundraisingsByOrganization = async (organizationId: number, skip = 0, limit = 100): Promise<Fundraising[]> => {
    try {
      const response = await axios.get<Fundraising[]>(`${BASE_URL}/fundraisings/by-organization/${organizationId}`, {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  