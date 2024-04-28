import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import fundraisingDefault from "../../assets/fundraising-default.png";
import { getFundraisings } from '../../services/api/fundraisings/fundraisings';  // API call to get fundraisings
import { getOrganizations } from '../../services/api/organizations/organizations';  // API call to get organizations
import './cards.scss';
import { Fundraising } from '../../types/FundraisingsData';
import { Organizations } from "../../types/OrganizationsData";

const Cards: React.FC = () => {
  const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
  const [organizations, setOrganizations] = useState<Organizations[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFundraisings = await getFundraisings();
      const fetchedOrganizations = await getOrganizations();
      setFundraisings(fetchedFundraisings);
      setOrganizations(fetchedOrganizations);
    };
    fetchData();
  }, []);

  const getOrganizationName = (orgId: number) => {
    const org = organizations.find(o => o.id === orgId);
    return org ? org.name : "Unknown Organization";
  };

  const currentCards = fundraisings
    .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
    .map(fundraising => ({
      ...fundraising,
      owner: getOrganizationName(fundraising.organization_id),
      img: fundraisingDefault,
      linkToBank: fundraising.sources[0]?.url || ''
    }));

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCardClick = (fundraising: Fundraising) => {
    navigate(`/fundraise/${fundraising.id}`, { state: fundraising });
  };

  const handlePayNowClick = (fundraising: Fundraising) => {
    navigate(`/subscribe/${fundraising.id}`, { state: fundraising });  // Assuming pay now goes to subscribe
  };

  return (
    <div className="d-flex flex-wrap gap-1 container">
      {currentCards.map((card, index) => (
        <div className="card-width" key={index}>
          <div className="card card-scale">
            <div className="card-body">
              <div className="d-flex flex-column gap-1 cursor-pointer mb-2" onClick={() => handleCardClick(card)}>
                <img className="col-12 object-fit-contain" src={card.img} alt={card.title} />
                <h5 className="card-text fw-semibold">{card.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{card.owner}</h6>
              </div>
              <button className="btn btn-outline-secondary fw-medium d-block mb-2" onClick={() => handlePayNowClick(card)}>
                Задонатити зараз
              </button>
              <button className="btn btn-primary fw-medium d-block" onClick={() => navigate(`/subscribe/${card.id}`, { state: card })}>
                Підписатись
              </button>
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

export default Cards;
