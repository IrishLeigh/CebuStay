import React, { useState, useEffect } from 'react';
import './PropertyListUI.css';
import SideBar from './components/SideBar';
import MainContent from './components/MainContent';
import axios from 'axios';
import { Container } from '@mui/material';
import SortMenu from './components/SortMenu';
import BannerOffers from './components/BannerOffers';

const PropertyListUI = () => {
  const [filters, setFilters] = useState({
    bedrooms: 'Any',
    beds: 'Any',
    bathrooms: 'Any',
    minPrice: '',
    maxPrice: '',
    bookingOptions: [],
    propertyTypes: []
  });
  const [searchData, setSearchData] = useState({
    destination: '',
    startDate: new Date(),
    endDate: null,
    guestCapacity: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [accommodationList, setAccommodationList] = useState([]);
  const [pricingList, setPricingList] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/allproperties');
        const properties = response.data;

        // Fetch images
        const imgResponse = await axios.get('http://127.0.0.1:8000/api/getallfirstimg');
        const imgMap = new Map();
        imgResponse.data.forEach(img => {
          imgMap.set(img.propertyid, img.src);
        });

        // Fetch amenities
        const amenityResponse = await axios.get('http://127.0.0.1:8000/api/getamenities');
        const amenityMap = new Map();
        if (amenityResponse.data.status === 'success') {
          amenityResponse.data.data.forEach(amenity => {
            if (!amenityMap.has(amenity.propertyid)) {
              amenityMap.set(amenity.propertyid, []);
            }
            amenityMap.get(amenity.propertyid).push(amenity.amenity_name);
          });
        }

        // Fetch pricing
        const pricingResponse = await axios.get('http://127.0.0.1:8000/api/allpropertypricing');
        const pricingMap = new Map();
        if (pricingResponse.data.status === 'success') {
          pricingResponse.data.pricings.forEach(pricing => {
            pricingMap.set(pricing.propertyid, pricing.min_price);
          });
          setPricingList(pricingResponse.data.pricings);
        }

        // Fetch locations
        const locationResponse = await axios.get('http://127.0.0.1:8000/api/getlocations');
        const locationMap = new Map();
        if (locationResponse.data.status === 'success') {
          locationResponse.data.data.forEach(location => {
            locationMap.set(location.propertyid, location.address);
          });
        }

        // Update properties with images, amenities, min_price, and address
        const updatedList = properties.map(property => ({
          ...property,
          src: imgMap.get(property.propertyid) || null,
          amenities: amenityMap.get(property.propertyid) || [],
          min_price: pricingMap.get(property.propertyid) || null,
          address: locationMap.get(property.propertyid) || null
        }));

        setAccommodationList(updatedList);
        console.log('Accommodation list with images, amenities, prices, and addresses:', updatedList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleAmenityChange = (amenities) => {
    setSelectedAmenities(amenities);
  };

  return (
    <Container maxWidth="lg">
      <BannerOffers accommodations={accommodationList} setAccommodationList={setAccommodationList} />
      <SortMenu />
      <div className="content-layout">
        <SideBar onAmenityChange={handleAmenityChange} onFilterChange={handleFilterChange} filters={filters} />
        <MainContent
          selectedAmenities={selectedAmenities}
          accommodations={accommodationList}
          filters={filters}
          searchData={searchData}
          setSearchData={setSearchData}
        />
      </div>
    </Container>
  );
};

export default PropertyListUI;

