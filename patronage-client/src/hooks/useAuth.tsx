import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, setUser } from '../store/authSlice';
import { RootState, AppDispatch } from '../store/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const status = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    } else if (status === 'idle') {
      dispatch(fetchUser()).then((action) => {
        if (fetchUser.fulfilled.match(action)) {
          sessionStorage.setItem('user', JSON.stringify(action.payload));
        }
      });
    }
  }, [dispatch, status]);

  return { user, status };
};
