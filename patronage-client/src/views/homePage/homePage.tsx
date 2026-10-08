import React from "react";
import PageLayout from '../../components/layout/pageLayout';
import Hero from '../../components/hero/hero';
import HowItWorks from '../../components/home/howItWorks';
import Fundraisings from '../../components/fundraisings/fundraisings';
import PhotoStrip from '../../components/home/photoStrip';

// Home: hero -> how it works -> the catalog (#zbory, target of both CTAs) -> photo strip.
const HomePage: React.FC = () => {
  return (
    <React.StrictMode>
      <PageLayout>
        <Hero />
        <HowItWorks />
        <section className="pm-section pt-2" id="zbory" aria-labelledby="zbory-title">
          <div className="container">
            <Fundraisings />
          </div>
        </section>
        <PhotoStrip />
      </PageLayout>
    </React.StrictMode>
  );
};

export default HomePage;
