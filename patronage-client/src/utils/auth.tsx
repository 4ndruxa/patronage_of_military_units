import { getMe } from '../services/api/auth/auth';

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getMe();
  return !!user;
};
