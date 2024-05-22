
import axiosInstance from '../../interceptor/axiosInstance';
import { handleError } from '../../errorHandler';
import { SubscriptionCreate, SubscriptionResponse } from '../../../types/SubscriptionsData';
import { Fundraising } from '../../../types/FundraisingsData';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createSubscription = async (data: SubscriptionCreate): Promise<SubscriptionResponse | void> => {
  try {
    const response = await axiosInstance.post<SubscriptionResponse>(`${BASE_URL}/subscriptions/`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSubscriptionsByUser = async (userId: number): Promise<Fundraising[] | void> => {
    try {
      const response = await axiosInstance.get<Fundraising[]>(`${BASE_URL}/subscriptions/by-user/${userId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
};

export const deleteSubscription = async (userId: number, subscriptionId: number): Promise<void> => {
  try {
    await axiosInstance.delete<void>(`${BASE_URL}/subscriptions/${userId}/${subscriptionId}`);
  } catch (error) {
    handleError(error);
  }
};