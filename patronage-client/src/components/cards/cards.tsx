import React, { useState } from "react";
import catImage from "../../assets/cat-money-maker.png";
import './card.css';

interface CardData {
  title: string;
  owner: string;
  img: string;
}

const Cards: React.FC = () => {
  // Mocked data for cards
  const cardsData: CardData[] = [
    { title: "Content for Card 1", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 2", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 3", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 4", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 5", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 6", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 7", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 8", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 9", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 10", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 11", owner: "3 Окрема Танкова Бригада", img: catImage },
    { title: "Content for Card 12", owner: "3 Окрема Танкова Бригада", img: catImage },
  ];

  const cardsPerPage = 6; // Number of cards per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index range for the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardsData.slice(indexOfFirstCard, indexOfLastCard);

  // Function to handle pagination clicks
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-1 container">
        {currentCards.map((card, index) => (
          <div className="card-width" key={index}>
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center gap-1">
                  <img className="col-12 object-fit-contain" src={card.img} alt={card.title} />
                  <h5 className="card-text fw-semibold">{card.title}</h5>
                </div>
                <button className="btn btn-light ps-0 fw-medium">
                  До {card.owner}
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
