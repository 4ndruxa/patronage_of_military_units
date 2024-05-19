import { store } from '../store/index';
import { showError } from '../store/errorSlice';

export const handleError = (error: any) => {
  console.error('An error occurred:', error.message || error);
  store.dispatch(showError(error.message || 'An unknown error occurred'));
};
