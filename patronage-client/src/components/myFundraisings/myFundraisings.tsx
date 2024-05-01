import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import fundraisingDefault from "../../assets/fundraising-default.png";
import { getFundraisingsByCreator, deleteFundraising } from '../../services/api/fundraisings/fundraisings';
import { Fundraising } from '../../types/FundraisingsData';

const MyFundraisings: React.FC = () => {
  const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const navigate = useNavigate();
  const creatorId = 1;

  useEffect(() => {
    const fetchFundraisings = async () => {
      const data = await getFundraisingsByCreator(creatorId);
      setFundraisings(data);
    };

    fetchFundraisings();
  }, [creatorId]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentCards = fundraisings
    .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
    .map(fundraising => ({
      ...fundraising,
      img: fundraisingDefault // Assuming all use the same default image
    }));

  return (
    <div className="d-flex flex-wrap gap-1 container">
      {currentCards.map((card, index) => (
        <div className="card-width" key={index}>
          <div className="card card-scale">
            <div className="card-body">
              <div className="d-flex flex-column gap-1 cursor-pointer mb-2" onClick={() => navigate(`/fundraisings/${card.id}`, { state: card })}>
                <img className="col-12 object-fit-contain" src={card.img} alt={card.title} />
                <h5 className="card-text fw-semibold">{card.title}</h5>
                <p>{card.description}</p>
              </div>
              <button className="btn btn-outline-secondary fw-medium d-block mb-2" onClick={() => navigate(`/edit-fundraising/${card.id}`, { state: card })}>
                Редагувати
              </button>
              <button className="btn btn-dark fw-medium d-block" onClick={() => {
                deleteFundraising(card.id).then(() => setFundraisings(fundraisings.filter(f => f.id !== card.id)));
              }}>Видалити</button>
            </div>
          </div>
        </div>
      ))}
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

export default MyFundraisings;