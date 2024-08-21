import React from 'react';
import Explore from './components/Explore';
import Popular from './components/Popular';
import Hidden from './components/Hidden';
import Footer from './components/Footer';
import BasicGrid from './components/Land';
import InteractiveMap from '../../InteractiveMap/InteractiveMap';

const LandingPageUI = () => {
  return (


      <>
      <div>
      <BasicGrid/>
      <InteractiveMap />
      <Popular />
      <Hidden />
      </div>
      <Footer/>
      </>
      
   
  );
};

export default LandingPageUI;
