import React, { useState, useEffect } from 'react';
import './MainContent.css';
import Search from './Search';
import { MdForward } from 'react-icons/md';
import {useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const MainContent = ({
  selectedAmenities = [],
  accommodations,
  filters = {
    minPrice: null,
    maxPrice: null,
    bedrooms: 'Any',
    beds: 'Any',
    bathrooms: 'Any',
    bookingOptions: [],
  },
  pricinglist = [],
}) => {
  const [selectedPropertyType, setSelectedPropertyType] = useState('Any');
  const [guestCapacity, setGuestCapacity] = useState(null);
  const [availability, setAvailability] = useState({ startDate: null, endDate: null });
  // const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [loading, setLoading] = useState(false); // Added state for loading
  const [error, setError] = useState(null); // Added state for error
  const [properties, setProperties] = useState([]); // Added state for properties
  const [availableproperties, setAvailableproperties] = useState([]); // Added state for available properties
  // const { minPrice, maxPrice, bedrooms, beds, bathrooms, bookingOptions } = filters;
  const location = useLocation();
  const  navigate = useNavigate();
  const { minPrice, maxPrice,bedrooms, beds, bathrooms, bookingOptions } = filters;
  const [checkin_date, setCheckin_date] = useState(null);
  const [checkout_date, setCheckout_date] = useState(null);
  const filteredAccommodations = accommodations.filter(accommodation => {
    // Check if the accommodation matches the selected amenities
  const amenityMatch = selectedAmenities.every(amenity =>
      accommodation.amenities.includes(amenity)
    );

    const priceInfo = pricinglist.find(price => price.propertyid === accommodation.propertyid);
    const priceMatch = priceInfo && 
      (!minPrice || priceInfo.min_price >= minPrice) &&
      (!maxPrice || priceInfo.min_price <= maxPrice);
      const bedroomsMatch = bedrooms === 'Any' || accommodation.bedroomcount >= parseInt(bedrooms, 10);
      const bedsMatch = beds === 'Any' || accommodation.bedcount >= parseInt(beds, 10);
      const bathroomsMatch = bathrooms === 'Any' || accommodation.bathroomcount >= parseInt(bathrooms, 10);
  
      const bookingOptionsMatch = bookingOptions.length === 0 ||
      bookingOptions.every(option => accommodation.booking_options.includes(option));

  // Return true if all filters match
  const propertyTypeMatch = selectedPropertyType === 'Any' || accommodation.property_type === selectedPropertyType;

  const guestCapacityMatch = guestCapacity === null || accommodation.guest_capacity >= parseInt(guestCapacity, 10);

  return amenityMatch && priceMatch && bedroomsMatch && bedsMatch && bathroomsMatch && bookingOptionsMatch && propertyTypeMatch && guestCapacityMatch;
});


const fetchProperties = async (checkin_date, checkout_date, guest_count) => {
  setLoading(true);
  setError(null); // Reset error state before making a new request
  const formattedCheckinDate = new Date(checkin_date).toISOString().slice(0, 10);
  const formattedCheckoutDate = new Date(checkout_date).toISOString().slice(0, 10);

  console.log("checkin_date:", formattedCheckinDate);
  console.log("checkout_date:", formattedCheckoutDate);
  console.log("guest_count:", guest_count);

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/getavailableproperties', {
      params: {
        checkin_date: formattedCheckinDate,
        checkout_date: formattedCheckoutDate,
        guest_count
      }
    });
    console.log("Response Data:", response.data); // Log the entire response object

    // Filter accommodations based on the response
    const availablePropertyIds = response.data.map(item => item.propertyid);
    const filteredAccommodations = accommodations.filter(accommodation => 
      availablePropertyIds.includes(accommodation.propertyid)
    );
    setAvailableproperties(filteredAccommodations);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};


  const handleSearchAvailability = ({ startDate, endDate, guestCapacity }) => {
    setAvailability({ startDate, endDate });
    setGuestCapacity(guestCapacity);
    fetchProperties(startDate, endDate, guestCapacity);
    setCheckin_date(startDate);
    setCheckout_date(endDate);
  };

  // useEffect(() => {
  //   setFilteredAccommodations(accommodations);
  // }, [accommodations]);

  const handlePropertyTypeClick = (type) => {
    setSelectedPropertyType(type);
  };

  const handleView = (e, propertyid) => {
    const state = {
      guestCapacity,
      checkin_date,
      checkout_date
    };
    navigate(`/accommodation/property/${propertyid}`, { state }); // Pass state along with navigation
  };

  return (
    <div className="all-container">
      <Search onSearch={handleSearchAvailability} />
      <div className="filter-buttons" style={{ marginLeft: '4.5rem' }}>
        <button className="btn-shiny2" onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'} onMouseLeave={(e) => e.target.style.backgroundColor = '#16B4DD'} onClick={() => handlePropertyTypeClick('Home')}>
          Home
        </button>
        <button className="btn-shiny4" onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'} onMouseLeave={(e) => e.target.style.backgroundColor = '#ADC939'} onClick={() => handlePropertyTypeClick('Hotel')}>
          Hotel
        </button>
        <button className="btn-shiny5" onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'} onMouseLeave={(e) => e.target.style.backgroundColor = '#F9CC41'} onClick={() => handlePropertyTypeClick('Homestay')}>
          Homestay
        </button>
        <button className="btn-shiny6" onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'} onMouseLeave={(e) => e.target.style.backgroundColor = '#EE414B'} onClick={() => handlePropertyTypeClick('Apartment')}>
          Apartment
        </button>
        <button className="btn-shiny7" onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'} onMouseLeave={(e) => e.target.style.backgroundColor = '#16B4DD'} onClick={() => handlePropertyTypeClick('Any')}>
          Others
        </button>
      </div>
      <div className="content-container" style={{ marginBottom: '63rem' }}>
        <div className="main-content" style={{ marginLeft: '2.3rem', display: 'flex', flexWrap: 'wrap' }}>
          {filteredAccommodations.map((accommodation, index) => (
            <div className="card" key={index} style={{ width: 'calc(33.33% - 1rem)', margin: '0.5rem' }} onClick={(e) => handleView(e, accommodation.propertyid)}>
              <div className="card-img">
                <img src={accommodation.src} alt={accommodation.property_name} />
              </div>
              <div className="card-info">
                <p className="text-title" style={{fontSize:'1.5rem'}}>{accommodation.property_name}</p>
                <p className="text-body">{accommodation.property_desc}</p>
              </div>
              <div className="card-footer">
                <span className="text-title" style={{fontSize:'2rem'}}>{"₱" + (pricinglist.find(price => price.propertyid === accommodation.propertyid)?.min_price || 'N/A')}</span>
                <div className="card-button">
                  <MdForward  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;