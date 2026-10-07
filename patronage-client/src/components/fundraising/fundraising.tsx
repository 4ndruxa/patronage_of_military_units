import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CardData } from "../../types/CardData";
import { createSubscription } from '../../services/api/subscriptions/subscriptions';
import { getFundraisingById } from '../../services/api/fundraisings/fundraisings';
import fundraisingDefault from "../../assets/fundraising-default.png";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Fundraising: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const { id: routeId } = useParams<{ id: string }>();

  const [fundraisingData, setFundraisingData] = useState<CardData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNotFound(false);
    // Cards pass the fundraising in navigation state (it survives a reload via
    // history.state); a direct link or a new tab arrives without it and has to
    // be fetched by the id in the URL.
    if (location.state) {
      setFundraisingData(location.state as CardData);
      return;
    }

    setFundraisingData(null);
    if (!routeId || !/^\d+$/.test(routeId) || Number(routeId) === 0) {
      setNotFound(true);
      return;
    }
    const fundraisingId = Number(routeId);

    let cancelled = false;
    getFundraisingById(fundraisingId).then((data) => {
      if (cancelled) {
        return;
      }
      if (data) {
        setFundraisingData({ ...data, description: data.description ?? '', img: fundraisingDefault });
      } else {
        setNotFound(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [location.state, routeId]);

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

  if (notFound) {
    return (
      <div className="container">
        <div className="d-flex flex-column align-items-center">
          <h1 className="mt-5 mb-3">Збір не знайдено</h1>
          <p className="fs-18">Можливо, його видалили або посилання неправильне.</p>
          <button className="btn btn-primary fw-medium" onClick={() => navigate('/patronage_of_military_units')}>
            До всіх зборів
          </button>
        </div>
      </div>
    );
  }

  if (!fundraisingData) {
    return <div>Loading...</div>;
  }

  const { title, description, organizations, img, sources, id } = fundraisingData;

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
        <img className="h-auto object-fit-contain w-50" src={img} alt={title} />
        <p className="fs-18 mt-3">
          {description}
          
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