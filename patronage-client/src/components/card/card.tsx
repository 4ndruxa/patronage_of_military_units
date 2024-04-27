import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardData } from "../../types/CardData";
import "./card.css";

const Card: React.FC = () => {
  const location = useLocation();
  const { title, owner, img } = location.state as CardData;

  // Mocked data for items
  const items: String[] = [
    "Ми дуже хороші, дайте грошей",
    "Ми дуже хороші, дайте грошей",
    "Ми дуже хороші, дайте грошей",
    "Ми дуже хороші, дайте грошей",
  ];

  const navigate = useNavigate();
  const handlePayNowClick = (card: CardData) => {
    navigate(`/subscribe/${card.id}`, { state: card }); // add link to bank
  };

  const handleSubscribeClick = (card: CardData) => {
    navigate(`/subscribe/${card.id}`, { state: card });
  };

  const renderButton = (
    text: string,
    style: string,
    onClick: (card: CardData) => void,
    card: CardData
  ) => {
    return (
      <button className={`btn ${style} fw-medium`} onClick={() => onClick(card)}>
        {text}
      </button>
    );
  };

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center">
        <h1 className="mt-5 mb-2">{title}</h1>
        <h4 className="text-secondary mb-3">{owner}</h4>
        <div className="d-flex gap-2 mb-5">
          {renderButton(
            "Задонатити зараз",
            "btn-outline-secondary",
            handlePayNowClick,
            location.state
          )}
          {renderButton(
            "Підписатись",
            "btn-secondary",
            handleSubscribeClick,
            location.state
          )}
        </div>
        <img className="h-auto object-fit-contain" src={img} alt={title} />
        <p className="fs-18 mt-3">
          {/* add content when back is ready */}
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown
          printer took a galley of type and scrambled it to make a type specimen
          book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum. Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </div>
      <div>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="d-flex gap-2 mb-5">
        {renderButton(
          "Задонатити зараз",
          "btn-outline-secondary",
          handlePayNowClick,
          location.state
        )}
        {renderButton(
          "Підписатись",
          "btn-secondary",
          handleSubscribeClick,
          location.state
        )}
      </div>
    </div>
  );
};

export default Card;
