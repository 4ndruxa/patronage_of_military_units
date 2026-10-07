import { errorMiddleware } from '../store/middleware/errorMiddleware';
import { showError } from '../store/errorSlice';
import { fetchUser } from '../store/authSlice';

const run = (action: any) => {
  const dispatch = jest.fn();
  const next = jest.fn((a) => a);
  errorMiddleware({ dispatch, getState: jest.fn() })(next)(action);
  return { dispatch, next };
};

describe('errorMiddleware', () => {
  test('shows an error for a rejected thunk', () => {
    const { dispatch, next } = run({
      type: 'fundraisings/fetch/rejected',
      error: { message: 'Network Error' },
    });
    expect(dispatch).toHaveBeenCalledWith(showError('Network Error'));
    expect(next).toHaveBeenCalled();
  });

  test('does not show an error when a guest is not logged in (auth/fetchUser rejected)', () => {
    const { dispatch, next } = run({
      type: fetchUser.rejected.type,
      error: { message: 'Request failed with status code 403' },
    });
    expect(dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
