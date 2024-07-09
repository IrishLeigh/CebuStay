import React, { useState, useEffect } from 'react';
import './MainContent.css';
import { MdForward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Loader from './loader';

const MainContent = ({
  selectedAmenities = [],
  accommodations = [], // Ensure this prop is passed correctly
  filters = {
    minPrice: null,
    maxPrice: null,
    bedrooms: 'Any',
    beds: 'Any',
    bathrooms: 'Any',
    bookingOptions: [],
    propertyTypes: [],
  },
}) => {
  const [guestCapacity, setGuestCapacity] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { minPrice, maxPrice, bedrooms, beds, bathrooms, bookingOptions, propertyTypes } = filters;
  const [checkin_date, setCheckin_date] = useState(null);
  const [checkout_date, setCheckout_date] = useState(null);

  const filteredAccommodations = accommodations.filter(accommodation => {
    const amenityMatch = selectedAmenities.every(amenity =>
      accommodation.amenities.includes(amenity)
    );

    const priceMatch = (!minPrice || accommodation.min_price >= minPrice) &&
      (!maxPrice || accommodation.min_price <= maxPrice);

    const bedroomsMatch = bedrooms === 'Any' || accommodation.bedroomcount >= parseInt(bedrooms, 10);
    const bedsMatch = beds === 'Any' || accommodation.bedcount >= parseInt(beds, 10);
    const bathroomsMatch = bathrooms === 'Any' || accommodation.bathroomcount >= parseInt(bathrooms, 10);

    const bookingOptionsMatch = bookingOptions.length === 0 ||
      bookingOptions.every(option => accommodation.booking_options.includes(option));

    const propertyTypeMatch = propertyTypes.length === 0 || 
      propertyTypes.includes(accommodation.property_type);
    const guestCapacityMatch = guestCapacity === null || accommodation.guest_capacity >= parseInt(guestCapacity, 10);

    return amenityMatch && priceMatch && bedroomsMatch && bedsMatch && bathroomsMatch && bookingOptionsMatch && propertyTypeMatch && guestCapacityMatch;
  });

  const handleView = (e, propertyid) => {
    const state = {
      guestCapacity,
      checkin_date,
      checkout_date
    };
    navigate(`/accommodation/property/${propertyid}`, { state });
  };

  useEffect(() => {
    // Add delay before setting loading to false
    if(filteredAccommodations.length > 0 || accommodations.length > 0) {
      setLoading(false);
    }

    // return () => clearTimeout(delay); // Cleanup function
  }, [filteredAccommodations, accommodations]); // Run only on component mount

  return (
    <div className="all-container">
      <div className="content-container" style={{ marginBottom: '76rem' }}>
        <div className="main-content" style={{ marginLeft: '2.3rem', display: 'flex', flexWrap: 'wrap' }}>
          {loading ? (
            Array(9).fill().map((_, index) => <Loader key={index} />) // Display 10 loader components
          ) : (
            filteredAccommodations.map((accommodation, index) => (
              <div className="card" key={index} style={{ width: 'calc(33.33% - 1rem)', margin: '0.5rem' }} onClick={(e) => handleView(e, accommodation.propertyid)}>
                <div className="card-img">
                  <img src={accommodation.src} alt={accommodation.property_name} />
                </div>
                <div className="card-info">
                  <div className="flex justify-between items-center mb-1" style={{margin:'0px'}}>
                    <p className="text-title" style={{ fontSize: '1rem' }}>{accommodation.property_name}</p>
                    {/* Star rating (dummy) */}
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-muted-foreground ml-1">4.5</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.9375rem', margin:'0px' }}>{accommodation.property_desc}</p>
                </div>
                <div className="card-footer">
                  <span className="text-title" style={{ fontSize: '0.8rem', backgroundColor:'#A334CF', color:'white', padding:'5px', borderRadius:'4px', marginTop:'5px' }}>{"$" + (accommodation.min_price? accommodation.min_price : 'N/A')} night</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
