import React from 'react';
import './Layout.css';
import SideBar from '../SearchFilterSideBar/SideBar';
import MainContent from '../components/MainContent';

const Layout = () => {
  return (
    <div className="layout-container">
      <SideBar/>
      <MainContent />
    </div>
  );
};

export default Layout;
