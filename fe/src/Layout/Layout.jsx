import React, { useState, useEffect } from 'react';
import './Layout.css';
import SideBar from '../SearchFilterSideBar/SideBar';
import MainContent from '../components/MainContent';
import axios from 'axios';
// import { accommodationlist, pricinglist } from '../components/MainContent';

const Layout = () => {
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [accommodationlist, setAccommodationlist] = useState([]);
const [pricinglist, setPricinglist] = useState([]);

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/allproperties');
      const properties = response.data;
      console.log("response", response);
      // Fetch images
      const imglist = await axios.get('http://127.0.0.1:8000/api/getallfirstimg');
      const imgMap = new Map();
      imglist.data.forEach(img => {
        imgMap.set(img.propertyid, img.src);
      });

      // Fetch amenities
      const amenityres = await axios.get('http://127.0.0.1:8000/api/getamenities');
      const amenityMap = new Map();
      if (amenityres.data.status === 'success') {
        amenityres.data.data.forEach(amenity => {
          if (!amenityMap.has(amenity.propertyid)) {
            amenityMap.set(amenity.propertyid, []);
          }
          amenityMap.get(amenity.propertyid).push(amenity.amenity_name);
        });
      }

      // Fetch pricing
      const pricingres = await axios.get('http://127.0.0.1:8000/api/allpropertypricing');
      const pricingMap = new Map();
      if (pricingres.data.status === 'success') {
        pricingres.data.pricings.forEach(pricing => {
          pricingMap.set(pricing.propertyid, pricing.min_price);
        });
        setPricinglist(pricingres.data.pricings);
      }

      // Fetch locations
      const locres = await axios.get('http://127.0.0.1:8000/api/getlocations');
      const locMap = new Map();
      if (locres.data.status === 'success') {
        locres.data.data.forEach(location => {
          locMap.set(location.propertyid, location.address);
        });
      }

      // Update properties with images, amenities, min_price, and address
      const updatedList = properties.map(property => ({
        ...property,
        src: imgMap.get(property.propertyid) || null, // Set image source if available
        amenities: amenityMap.get(property.propertyid) || [], // Set amenities if available
        min_price: pricingMap.get(property.propertyid) || null, // Set min_price if available
        address: locMap.get(property.propertyid) || null // Set address if available
      }));

      setAccommodationlist(updatedList);
      console.log('Accommodation list with images, amenities, prices, and addresses:', updatedList);
    } catch (error) {
      console.error(error);
    }
  };

  fetchProperties();
}, []);



  

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
