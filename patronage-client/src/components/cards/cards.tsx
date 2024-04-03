import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import catImage from "../../assets/cat-money-maker.png";
import './cards.css';
import { CardData } from "../../types/CardData";

const Cards: React.FC = () => {
  // Mocked data for cards
  const cardsData: CardData[] = [
    { title: "Content for Card 1", owner: "3 Окрема Танкова Бригада", img: catImage, id: 1, linkToBank: '' },
    { title: "Content for Card 2", owner: "3 Окрема Танкова Бригада", img: catImage, id: 2, linkToBank: '' },
    { title: "Content for Card 3", owner: "3 Окрема Танкова Бригада", img: catImage, id: 3, linkToBank: '' },
    { title: "Content for Card 4", owner: "3 Окрема Танкова Бригада", img: catImage, id: 4, linkToBank: '' },
    { title: "Content for Card 5", owner: "3 Окрема Танкова Бригада", img: catImage, id: 5, linkToBank: '' },
    { title: "Content for Card 6", owner: "3 Окрема Танкова Бригада", img: catImage, id: 6, linkToBank: '' },
    { title: "Content for Card 7", owner: "3 Окрема Танкова Бригада", img: catImage, id: 7, linkToBank: '' },
    { title: "Content for Card 8", owner: "3 Окрема Танкова Бригада", img: catImage, id: 8, linkToBank: '' },
    { title: "Content for Card 9", owner: "3 Окрема Танкова Бригада", img: catImage, id: 9, linkToBank: '' },
    { title: "Content for Card 10", owner: "3 Окрема Танкова Бригада", img: catImage, id: 10, linkToBank: '' },
    { title: "Content for Card 11", owner: "3 Окрема Танкова Бригада", img: catImage, id: 11, linkToBank: '' },
    { title: "Content for Card 12", owner: "3 Окрема Танкова Бригада", img: catImage, id: 12, linkToBank: '' },
    { title: "Content for Card 13", owner: "3 Окрема Танкова Бригада", img: catImage, id: 13, linkToBank: '' },
  ];

  const cardsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardsData.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const navigate = useNavigate();
  const handleCardClick = (card: CardData) => {
    navigate(`/fundraise/${card.id}`, { state: card });
  };

  const handlePayNowClick = (card: CardData) => {
    navigate(`/subscribe/${card.id}`, { state: card }); // add link to bank
  };

  const handleSubscribeClick = (card: CardData) => {
    navigate(`/subscribe/${card.id}`, { state: card });
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-1 container">
        {currentCards.map((card, index) => (
          <div className="card-width" key={index}>
            <div className="card card-scale">
              <div className="card-body">
                <div className="d-flex flex-column gap-1 cursor-pointer" onClick={() => handleCardClick(card)}>
                  <img className="col-12 object-fit-contain" src={card.img} alt={card.title} />
                  <h5 className="card-text fw-semibold">{card.title}</h5>
                </div>
                <button className="btn btn-light ps-0 fw-medium d-block my-2" onClick={() => handleCardClick(card)}>
                  До {card.owner}
                </button>
                <button className="btn btn-outline-secondary fw-medium d-block mb-2" onClick={() => handlePayNowClick(card)}>
                  Задонатити зараз
                </button>
                <button className="btn btn-secondary fw-medium d-block" onClick={() => handleSubscribeClick(card)}>
                  Підписатись
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav aria-label="..." className="d-flex justify-content-center my-2">
        <ul className="pagination pagination-sm">
          {[...Array(Math.ceil(cardsData.length / cardsPerPage))].map((_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? 'active-card-page' : ''}`} key={index} role="button">
              <span className="page-link text-dark" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
                {currentPage === index + 1 && <span className="sr-only">(current)</span>}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Cards;
