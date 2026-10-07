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
    <div className="pm-toast-area">
      <div className="toast show pm-toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex p-3 gap-3">
          <span style={{ color: 'var(--pm-danger)' }}>
            <svg className="pm-i" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" />
            </svg>
          </span>
          <div className="flex-grow-1">
            <strong className="d-block">Не вдалося виконати дію</strong>
            <span className="small pm-muted">{error}</span>
          </div>
          <button type="button" className="btn-close" aria-label="Закрити" onClick={handleClose}></button>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
