import React from 'react';
import Explore from './Explore';
import Popular from './Popular';
import Hidden from './Hidden';
import Footer from './Footer';
import BasicGrid from './Land';

const LayoutLandingPage = () => {
  return (
    <>
     <div>
      <BasicGrid/>
      <Explore />
      <Popular />
      <Hidden />
    </div>
    <Footer/>

    </>
   
  );
};

export default LayoutLandingPage;
