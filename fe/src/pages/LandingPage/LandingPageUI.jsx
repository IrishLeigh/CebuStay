import React from 'react';
import Explore from './components/Explore';
import Popular from './components/Popular';
import Hidden from './components/Hidden';
import Footer from './components/Footer';
import BasicGrid from './components/Land';
import InteractiveMap from '../../InteractiveMap/InteractiveMap';
import LandingCover from './components/LandingCover';
const LandingPageUI = () => {
  return (


      <>
      <div>
      <LandingCover/>
      {/* <BasicGrid/> */}
      <InteractiveMap />
      <Popular />
      <Hidden />
      </div>
      <Footer/>
      </>
      
   
  );
};

export default LandingPageUI;
