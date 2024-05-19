import axiosInstance from '../../interceptor/axiosInstance';

export const login = async (code: string) => {
  const response = await axiosInstance.post('/oauth/google/callback', { code });
  return response.data;
};

export const getMe = async (): Promise<{ user: any } | null> => {
  try {
    const response = await axiosInstance.get('/me');
    return response.data.user;
  } catch (error) {
    console.error("Failed to fetch user information", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post('/logout');
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
