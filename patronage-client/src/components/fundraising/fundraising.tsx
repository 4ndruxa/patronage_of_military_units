import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardData } from "../../types/CardData";
import { createSubscription } from '../../services/api/subscriptions/subscriptions';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Fundraising: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [fundraisingData, setFundraisingData] = useState<CardData | null>(null);

  useEffect(() => {
    if (location.state) {
      setFundraisingData(location.state as CardData);
    }
  }, [location.state]);

  const navigateToBankLink = () => {
    if (fundraisingData && fundraisingData.sources && fundraisingData.sources.length > 0) {
      const url = fundraisingData.sources[0]?.url;
      if (url) {
        navigate('/redirect-bank-link', { state: { url } });
      } else {
        console.error("No URL found for the first source");
      }
    }
  };

  const handleSubscribe = async () => {
    if (user && fundraisingData) {
      try {
        const subscriptionData = { fundraising_id: fundraisingData.id, user_id: user.id };
        await createSubscription(subscriptionData);
      } catch (error) {
        console.error("Failed to create subscription", error);
      }
    } else {
      console.error("User is not authenticated or fundraising data is missing");
    }
  };

  if (!fundraisingData) {
    return <div>Loading...</div>;
  }

  const { title, organizations, img, sources, id } = fundraisingData;

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center">
        <h1 className="mt-5 mb-2">{title}</h1>
        <button className="btn btn-light mb-3" onClick={() => navigate(`/organizations/${organizations.id}`)}>
          {organizations.name}
        </button>
        <div className="d-flex gap-2 mb-5">
          <button className="btn btn-outline-secondary fw-medium" onClick={navigateToBankLink}>
            Задонатити зараз
          </button>
          <button className="btn btn-primary fw-medium" onClick={handleSubscribe}>
            Підписатись
          </button>
        </div>
        <img className="h-auto object-fit-contain w-75" src={img} alt={title} />
        <p className="fs-18 mt-3">
          {/* add content when back is ready */}
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
          specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
          It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </div>
      <div className="d-flex gap-2 mb-5">
        <button className="btn btn-outline-secondary fw-medium" onClick={navigateToBankLink}>
          Задонатити зараз
        </button>
        <button className="btn btn-primary fw-medium" onClick={handleSubscribe}>
          Підписатись
        </button>
      </div>
    </div>
  );
};

export default Fundraising;