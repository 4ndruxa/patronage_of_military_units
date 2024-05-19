import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, setUser } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store/store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector((state: RootState) => state.auth.user !== null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
      } else if (!isAuth) {
        await dispatch(fetchUser());
      }
      setAuthChecked(true);
      if (!isAuth) {
        navigate('/login', { replace: true });
      }
    };
    checkAuth();
  }, [dispatch, isAuth, navigate]);

  return isAuth ? children : null;
};

export default ProtectedRoutes;
