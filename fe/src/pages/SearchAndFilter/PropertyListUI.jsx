import React, { useState, useEffect } from 'react';
import './PropertyListUI.css';
import SideBar from './components/SideBar';
import MainContent from './components/MainContent';
import axios from 'axios';
import { Container } from '@mui/material';
import BannerOffers from './components/BannerOffers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronLeft } from '@fortawesome/free-solid-svg-icons'; // Bars for opening, Chevron for closing
import MenuIcon from '@mui/icons-material/Menu'; // Icon for the toggle button

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
  const [originalAccommodationList, setOriginalAccommodationList] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Define state here

  const [searchUpdateData, setSearchUpdateData] = useState({
    checkin_date: null,
    checkout_date: null,
    guestCapacity: null,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect mobile

  // Sidebar toggle function
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };


  // Handle mobile screen detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768); // Show sidebar on larger screens
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            if(amenity.amenity_name === 'Airconditioning'){
              amenityMap.get(amenity.propertyid).push('Air Conditioning');
            } else if(amenity.amenity_name === 'Minibar'){
              amenityMap.get(amenity.propertyid).push('Mini Bar');
            } else if(amenity.amenity_name === 'Wi-fi'){
              amenityMap.get(amenity.propertyid).push('Wi-Fi');
            } else {
              amenityMap.get(amenity.propertyid).push(amenity.amenity_name);
            }
            
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
        const updatedList = properties.map(property => {
          // Initialize an empty array for booking options
          const bookingOptionsArray = [];
        
          // Get the first booking policy
          const bookingPolicy = property.booking_policies && property.booking_policies.length > 0 ? property.booking_policies[0] : {};
        
          // Check the booking policy and push to bookingOptionsArray if the value is 1
          if (bookingPolicy.isCancellationPolicy === 1) {
            bookingOptionsArray.push("Cancellation Plan");
          }
          if (bookingPolicy.non_refundable === 1) {
            bookingOptionsArray.push("Non-Refundable");
          }
          if (bookingPolicy.isModificationPolicy === 1) {
            bookingOptionsArray.push("Modification Plan");
          }
        
          // Get the first house rule
          const houseRule = property.house_rules && property.house_rules.length > 0 ? property.house_rules[0] : {};
        
          // Check house rules and push to bookingOptionsArray based on their values
          if (houseRule.pets_allowed === 1) {
            bookingOptionsArray.push("Allows Pets");
          }
          if (houseRule.smoking_allowed === 1) {
            bookingOptionsArray.push("Allow Smoking");
          }
          if (houseRule.parties_events_allowed === 1) {
            bookingOptionsArray.push("Party Events Allowed");
          }
          if (houseRule.noise_restrictions === "1") {
            bookingOptionsArray.push("Noise Restrictions");
          }
        
          // Add any additional conditions for house rules if necessary
        
          return {
            ...property,
            src: imgMap.get(property.propertyid) || null,
            amenities: amenityMap.get(property.propertyid) || [],
            min_price: pricingMap.get(property.propertyid) || null,
            address: locationMap.get(property.propertyid) || null,
            bookingoptions: bookingOptionsArray // Combine both booking options and house rules
          };
        });
                
        
        setAccommodationList(updatedList);
        setOriginalAccommodationList(updatedList);
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

  const handleSearchUpdate = ({ guestCapacity, checkin_date, checkout_date }) => {
    setSearchUpdateData({ guestCapacity, checkin_date, checkout_date });
    console.log("Guest Capacity FROM PROPERTY LIST:", guestCapacity);
    console.log("Checkin Date  PROPERTY LIST:", checkin_date);
    console.log("Checkout Date  PROPERTY LIST:", checkout_date);
  };

  return (
    <Container maxWidth="lg">
      <BannerOffers accommodations={accommodationList} setAccommodationList={setAccommodationList}  onSearchUpdate={handleSearchUpdate} originalAccommodationList={originalAccommodationList}/>

      <div className="content-layout">
        {/* Sidebar with toggle state */}
        <SideBar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
          onAmenityChange={handleAmenityChange} 
          onFilterChange={handleFilterChange} 
          filters={filters} 
        />

        {/* Main content */}
        <MainContent
          selectedAmenities={selectedAmenities}
          accommodations={accommodationList}
          filters={filters}
          searchData={searchData}
          setSearchData={setSearchData}
          searchUpdate = {searchUpdateData}
        />
      </div>
    </Container>
  );
};

export default PropertyListUI;
