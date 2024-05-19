import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/index';
import { hideError } from '../../store/errorSlice';

const ErrorAlert: React.FC = () => {
  const error = useSelector((state: RootState) => state.error.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(hideError());
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [error, dispatch]);

  const handleClose = () => {
    dispatch(hideError());
  };

  if (!error) {
    return null;
  }

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      {error}
      <button type="button" className="btn-close" onClick={handleClose}></button>
    </div>
  );
};

export default ErrorAlert;