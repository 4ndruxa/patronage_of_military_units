import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardData } from "../../types/CardData";

const Fundraising: React.FC = () => {
  const location = useLocation();
  const { title, organizations, img, linkToBank } = location.state as CardData;

  const navigate = useNavigate();

  // Navigation function to go to organization details page
  const navigateToOrganization = (organizationId: number) => {
    navigate(`/organizations/${organizationId}`);
  };

  // Function to render buttons
  const renderButton = (text: string, style: string, onClick: () => void) => (
    <button className={`btn ${style} fw-medium`} onClick={onClick}>
      {text}
    </button>
  );

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center">
        <h1 className="mt-5 mb-2">{title}</h1>
        <button className="btn btn-light mb-3" onClick={() => navigateToOrganization(organizations.id)}>
          {organizations.name}
        </button>
        <div className="d-flex gap-2 mb-5">
          {renderButton("Задонатити зараз", "btn-outline-secondary", () => navigate(linkToBank))}
          {renderButton("Підписатись", "btn-primary", () => navigate(`/subscribe/${location.state.id}`))}
        </div>
        <img className="h-auto object-fit-contain w-75" src={img} alt={title} />
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
      <div className="d-flex gap-2 mb-5">
        {renderButton("Задонатити зараз", "btn-outline-secondary", () => navigate(linkToBank))}
        {renderButton("Підписатись", "btn-primary", () => navigate(`/subscribe/${location.state.id}`))}
      </div>
    </div>
  );
};

export default Fundraising;
