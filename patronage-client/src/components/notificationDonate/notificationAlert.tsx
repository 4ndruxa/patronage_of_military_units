import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './notificationAlert.scss';

const AlertComponent: React.FC = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

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

  const handleDonateClick = () => {
    navigate('/my-subscriptions');
    setShow(false);
  };

  return (
    <>
      <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Заплановане сповіщення</h5>
            </div>
            <div className="modal-body">
            <div className="text-center mb-5">
              <h2>Підтримай українську армію!</h2>
              <p className="fs-18">
                Дякуємо, що ви підтримуєте наші благодійні збори. Нижче ви знайдете збір коштів, за які ви відповідальні. 
                Вони з нетерпінням чекають на ваші пожертви, які є надзвичайно важливими для наших військових. 
                Будь ласка, пам'ятайте, що кожного місяця, на перший день, наш фонд очікує на ваші внески.
              </p>
              <p className="fs-18">
                Натисніть на кнопку "Задонатити зараз", щоб зробити свій внесок та допомогти нашим героям на передовій. 
                Ваші пожертви роблять реальну різницю!
              </p>
            </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>Закрити</button>
              <button type="button" className="btn btn-primary" onClick={handleDonateClick}>Задонатити зараз</button>
            </div>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default AlertComponent;