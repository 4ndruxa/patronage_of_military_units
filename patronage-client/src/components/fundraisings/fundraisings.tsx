import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import fundraisingDefault from "../../assets/fundraising-default.png";
import { getFundraisings, getFundraisingsByOrganization } from '../../services/api/fundraisings/fundraisings';
import './fundraisings.scss';
import { Fundraising } from '../../types/FundraisingsData';

const Fundraisings: React.FC<{ organizationId?: number }> = ({ organizationId }) => {
  const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFundraisings = organizationId ? 
        await getFundraisingsByOrganization(organizationId) : 
        await getFundraisings();
      setFundraisings(fetchedFundraisings);
    };
    fetchData();
  }, [organizationId]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCardClick = (fundraising: Fundraising) => {
    navigate(`/fundraisings/${fundraising.id}`, { state: fundraising });
  };

  const currentCards = fundraisings.slice(
    (currentPage - 1) * cardsPerPage, 
    currentPage * cardsPerPage
  ).map(fundraising => ({
    ...fundraising,
    img: fundraisingDefault
  }));

  return (
    <div className="d-flex flex-wrap gap-1 container">
      {currentCards.map((card, index) => (
        <div className="card-width" key={index}>
          <div className="card card-scale" onClick={() => handleCardClick(card)}>
            <img className="col-12 object-fit-contain" src={card.img} alt={card.title} />
            <div className="card-body">
              <h5 className="card-text fw-semibold">{card.title}</h5>
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

export default Fundraisings;