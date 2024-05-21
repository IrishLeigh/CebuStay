import React, { useState } from 'react';
import './Layout.css';
import SideBar from '../SearchFilterSideBar/SideBar';
import MainContent from '../components/MainContent';
import { accommodationlist, pricinglist } from '../components/MainContent';

const Layout = () => {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [filters, setFilters] = useState({
    bedrooms: 'Any',
    beds: 'Any',
    bathrooms: 'Any',
    minPrice: '',
    maxPrice: '',
    bookingOptions: []
  });

  const [searchData, setSearchData] = useState({
    destination: '',
    startDate: new Date(),
    endDate: null,
    guestCapacity: '',
});

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleAmenityChange = (amenities) => {
    setSelectedAmenities(amenities);
  };

  return (
    <div className="layout-container">
      <SideBar onAmenityChange={handleAmenityChange} onFilterChange={handleFilterChange} filters={filters} />
      <MainContent selectedAmenities={selectedAmenities} accommodations={accommodationlist} filters={filters} pricinglist={pricinglist} searchData={searchData} setSearchData={setSearchData} />
    </div>
  );
};

export default Layout;
