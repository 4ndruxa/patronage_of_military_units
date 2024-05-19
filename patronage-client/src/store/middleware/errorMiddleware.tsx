import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { showError } from '../errorSlice';

export const errorMiddleware: any = 
  (storeAPI: MiddlewareAPI<Dispatch<AnyAction>, any>) => 
  (next: Dispatch<AnyAction>) => 
  (action: AnyAction) => {
    if (action.type.includes('rejected') && action.error) {
      storeAPI.dispatch(showError(action.error.message || 'An unknown error occurred'));
    }
    return next(action);
  };