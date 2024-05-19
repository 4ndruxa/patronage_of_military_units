import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import fundraisingDefault from "../../assets/fundraising-default.png";
import { getSubscriptionsByUser } from '../../services/api/subscriptions/subscriptions';
import { Fundraising } from '../../types/FundraisingsData';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const MySubscriptions: React.FC = () => {
  const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user) {
        const data = await getSubscriptionsByUser(user.id);
        if (data) {
          setFundraisings(data);
        }
      }
    };

    fetchSubscriptions();
  }, [user]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentCards = fundraisings
    .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
    .map(fundraising => ({
      ...fundraising,
      img: fundraisingDefault
    }));

  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <h2>Підтримай українську армію!</h2>
        <p className="fs-18">
          Дякуємо, що ви підтримуєте наші благодійні збори. Нижче ви знайдете збір коштів, за які ви відповідальні. 
          Вони з нетерпінням чекають на ваші пожертви, які є надзвичайно важливими для наших військових. 
          Будь ласка, пам'ятайте, що кожного місяця, на перший день, наші фонди очікуюють на ваші внески.
        </p>
        <p className="fs-18">
          Натисніть на кнопку 'Задонатити зараз', щоб зробити свій внесок та допомогти нашим героям на передовій. 
          Ваші пожертви роблять реальну різницю!
        </p>
      </div>
      <div className="d-flex flex-wrap gap-1 justify-content-center">
        {currentCards.map((card, index) => (
          <div className="card-width" key={index}>
            <div className="card card-scale">
              <div className="card-body">
                <div className="d-flex flex-column gap-1 cursor-pointer mb-2" onClick={() => navigate(`/fundraisings/${card.id}`, { state: card })}>
                  <img className="col-12 object-fit-contain" src={card.img} alt={card.title} />
                  <h5 className="card-text fw-semibold">{card.title}</h5>
                  <p>{card.description}</p>
                </div>
                <button className="btn btn-outline-secondary fw-medium d-block mb-2" onClick={() => navigate(`/fundraisings/${card.id}`, { state: card })}>
                  Переглянути
                </button>
                <button className="btn btn-primary fw-medium d-block" onClick={() => navigate(`/fundraisings/${card.id}`, { state: card })}>
                  Задонатити зараз
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav aria-label="..." className="d-flex justify-content-center my-2 w-100">
        <ul className="pagination pagination-sm">
          {[...Array(Math.ceil(fundraisings.length / cardsPerPage))].map((_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? 'active-card-page' : ''}`} key={index} role="button">
              <span className="page-link text-primary" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MySubscriptions;