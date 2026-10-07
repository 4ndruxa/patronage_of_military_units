import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import logo from '../../assets/logo-144.png';

const AlertComponent: React.FC = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const showAlert = () => {
      setShow(true);
    };

    const currentDate = new Date();
    const firstDayNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1, 9, 0, 0, 0);

    const timeToNextFirst = firstDayNextMonth.getTime() - currentDate.getTime();

    const timeoutId = setTimeout(() => {
      showAlert();
    }, timeToNextFirst);

    return () => clearTimeout(timeoutId);
  }, []);

  // aria-modal: move focus into the dialog and let Escape close it.
  useEffect(() => {
    if (!show || !user) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShow(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, user]);

  const handleDonateClick = () => {
    navigate('/my-subscriptions');
    setShow(false);
  };

  // The reminder speaks to a subscriber; guests have nothing to go to.
  if (!user) {
    return null;
  }

  return (
    <>
      <div
        className={`modal ${show ? 'show' : ''}`}
        style={{ display: show ? 'block' : 'none' }}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-reminder-title"
      >
        <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: 480 }}>
          <div className="modal-content">
            <div className="modal-header pm-modal-head pm-on-dark">
              <span className="d-flex align-items-center gap-3">
                <span className="pm-logo-chip" style={{ width: 48, height: 48 }}><img src={logo} alt="" /></span>
                <span className="fw-bold">Щомісячне нагадування</span>
              </span>
              <button ref={closeButtonRef} type="button" className="btn-close btn-close-white" aria-label="Закрити" onClick={() => setShow(false)}></button>
            </div>
            <div className="modal-body text-center">
              <h2 id="pm-reminder-title" className="h3 mb-2" style={{ fontSize: '1.375rem' }}>
                Настав новий місяць. Час підтримати збори, на які ви підписані.
              </h2>
              <p className="pm-muted mb-3">
                У підписках ви знайдете свої збори й посилання на сторінки організацій.
              </p>
              <p className="pm-caption mb-0">
                Гроші ми не збираємо: донат ви робите на сторінці організації і самі обираєте суму.
              </p>
            </div>
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-outline-ink" onClick={() => setShow(false)}>Закрити</button>
              <button type="button" className="btn btn-donate" onClick={handleDonateClick}>Перейти до підписок</button>
            </div>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default AlertComponent;
