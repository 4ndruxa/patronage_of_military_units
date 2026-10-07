import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import Hero from '../../components/hero/hero';
import Cards from '../../components/fundraisings/fundraisings';

const HomePage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <Hero />
        <Cards />
      </PageLayout>
    </React.StrictMode>
  );
};

export default HomePage;
