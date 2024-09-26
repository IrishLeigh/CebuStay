import React from 'react';
import Explore from './components/Explore';
import Popular from './components/Popular';
import Hidden from './components/Hidden';
import Footer from './components/Footer';
import BasicGrid from './components/Land';
import InteractiveMap from '../../InteractiveMap/InteractiveMap';
import LandingCover from './components/LandingCover';
import { useRef } from 'react';
const LandingPageUI = () => {
  const mapRef = useRef(null);

  // Function to scroll to the map
  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (


      < div style ={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div>
        <LandingCover onSeeMapClick={scrollToMap} />
        {/* <BasicGrid/> */}
        <div ref={mapRef}>
          <InteractiveMap />

        </div>
        
        {/* <Popular /> */}
        {/* <Hidden /> */}
        </div>
        <Footer/>
      </div >
      
   
  );
};

export default LandingPageUI;
