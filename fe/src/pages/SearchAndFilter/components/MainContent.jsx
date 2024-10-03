import React, { useState, useEffect } from 'react';
import './MainContent.css';
import { MdForward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Loader from './loader';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';
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
  },searchUpdate
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
      bookingOptions.every(option => accommodation.bookingoptions.includes(option));

    const propertyTypeMatch = propertyTypes.length === 0 || 
      propertyTypes.includes(accommodation.property_type);
    const guestCapacityMatch = guestCapacity === null || accommodation.guest_capacity >= parseInt(guestCapacity, 10);

    return amenityMatch && priceMatch && bedroomsMatch && bedsMatch && bathroomsMatch && bookingOptionsMatch && propertyTypeMatch && guestCapacityMatch;
  });

  const handleView = (e, propertyid) => {
    // Construct query params
    const queryParams = new URLSearchParams({
      guestCapacity: searchUpdate.guestCapacity || '', // Default to empty string if null
      checkin_date: searchUpdate.checkin_date || '', // Default to empty string if null
      checkout_date: searchUpdate.checkout_date || '', // Default to empty string if null
    }).toString();

    console.log("Query Params:", queryParams);
  
    // Navigate to the property page with query parameters
    navigate(`/property/${propertyid}?${queryParams}`);
  };
  

  useEffect(() => {
    // Add delay before setting loading to false
    if(filteredAccommodations.length > 0 || accommodations.length > 0) {
      setLoading(false);
    }

    // return () => clearTimeout(delay); // Cleanup function
  }, [filteredAccommodations, accommodations]); // Run only on component mount

  console.log("SEARCH UPDATE FROM MAIN",searchUpdate );
  return (
    <div>
      <div className="content-container">
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
                  <div className="card-title" style={{margin:'0px'}}>
                    <p className="text-title" style={{ fontSize: '1rem' }}>{accommodation.property_name}</p>
                    {/* Star rating (dummy) */}
                    <div className="" style={{fontSize: '0.9rem'}}>
                      <span className="">★</span>
                      <span className="">{accommodation.rating}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '0px' }}>
                    <LocationOnIcon style={{ marginRight: '2px', fontSize: '1rem', margin: '0px', padding: '0px', opacity: '0.9' }} />
                    <p className="" style={{ fontSize: '0.8rem', margin: '0px', opacity: '0.9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {accommodation.address}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '0px' }}>
                    {(accommodation.property_type === 'Home' || accommodation.property_type === 'Apartment') ? 
                    <HomeOutlinedIcon style={{ marginRight: '2px', fontSize: '1rem', margin: '0px', padding: '0px', opacity: '0.9' }} /> 
                    : <ApartmentIcon style={{ marginRight: '2px', fontSize: '1rem', margin: '0px', padding: '0px', opacity: '0.9' }} />}
                    <p className="" style={{ fontSize: '0.8rem', margin: '0px', opacity: '0.9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {accommodation.property_type}
                    </p>
                  </div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.9375rem', margin:'0px', opacity:'0.6', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontStyle: 'italic' }}>{accommodation.property_desc}</p>
                </div>
                <div className="card-footerr">
                  <span className="text-title" style={{ fontSize: '0.8rem', backgroundColor:'#A334CF', color:'white', padding:'5px', borderRadius:'4px', marginTop:'5px' }}>{"₱ " + (accommodation.min_price? accommodation.min_price : 'N/A')} night</span>
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
