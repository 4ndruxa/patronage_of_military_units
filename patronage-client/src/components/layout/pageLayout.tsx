import React from 'react';
import Header from '../header/header';
import Footer from './footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

// Every page: sticky header, the page content in <main>, footer.
const PageLayout: React.FC<PageLayoutProps> = ({ children }) => (
  <div className="pm-page">
    <a className="visually-hidden-focusable" href="#main">Перейти до змісту</a>
    <Header />
    <main id="main">{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
