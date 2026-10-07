import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { showError } from '../errorSlice';
import { fetchUser } from '../authSlice';

// Rejections that are expected and must not raise the global error banner.
// `auth/fetchUser` is rejected (403 from /me) for every guest: that means
// "not logged in", not an error.
const SILENT_REJECTIONS = new Set<string>([fetchUser.rejected.type]);

export const errorMiddleware: any = 
  (storeAPI: MiddlewareAPI<Dispatch<AnyAction>, any>) => 
  (next: Dispatch<AnyAction>) => 
  (action: AnyAction) => {
    if (action.type.includes('rejected') && action.error && !SILENT_REJECTIONS.has(action.type)) {
      storeAPI.dispatch(showError(action.error.message || 'An unknown error occurred'));
    }
    return next(action);
  };
