import React from "react";
import Header from '../../components/header/header';
import Hero from '../../components/hero/hero';
import Cards from '../../components/fundraisings/fundraisings';

const HomePage: React.FC = () => {
  return (
    <React.StrictMode>
      <Header />
      <Hero />
      <Cards />
    </React.StrictMode>
  );
};

export default HomePage;
