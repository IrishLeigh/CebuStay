import React from 'react';
import Landing from './Landing';
import Explore from './Explore';
import Popular from './Popular';
import Hidden from './Hidden';
import Footer from './Footer';
import MainContent from '../MainContent';
import Layout from '../../Layout/Layout';

const LayoutLandingPage = () => {
  return (
    <div>
      <Landing />
      <Explore />
      <Popular />
      <Hidden />
      <Footer />
    </div>
  );
};

export default LayoutLandingPage;
