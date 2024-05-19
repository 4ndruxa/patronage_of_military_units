import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BankLinkRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = location.state?.url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      navigate('/patronage_of_military_units');
    } else {
      console.error("No URL found for redirection");
      navigate('/patronage_of_military_units');
    }
  }, [location, navigate]);

  return <div>Redirecting...</div>;
};

export default BankLinkRedirect;
