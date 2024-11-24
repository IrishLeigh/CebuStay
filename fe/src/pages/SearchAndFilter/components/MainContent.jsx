import React, { useState, useEffect } from 'react';
import './MainContent.css';
import { MdForward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Loader from './loader';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';


// const MainContent = ({
//   selectedAmenities = [],
//   accommodations = [], // Ensure this prop is passed correctly
//   filters = {
//     minPrice: null,
//     maxPrice: null,
//     bedrooms: 'Any',
//     beds: 'Any',
//     bathrooms: 'Any',
//     bookingOptions: [],
//     propertyTypes: [],
//   },
//   searchUpdate,
// }) => {
//   const [guestCapacity, setGuestCapacity] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { minPrice, maxPrice, bedrooms, beds, bathrooms, bookingOptions, propertyTypes } = filters;
//   const [checkin_date, setCheckin_date] = useState(null);
//   const [checkout_date, setCheckout_date] = useState(null);
  

//   // Dummy data for accommodations
//   const dummyAccommodations = [
//     {
//       propertyid: 1,
//       src: "https://via.placeholder.com/250",
//       property_name: "Sunset Beach House",
//       rating: 4.5,
//       address: "123 Ocean Drive, Beach City",
//       property_type: "Home",
//       property_desc: "A beautiful beach house with a stunning view of the ocean.",
//       min_price: 3500,
//       bedroomcount: 3,
//       bedcount: 3,
//       bathroomcount: 2,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Air Conditioning"],
//       guest_capacity: 6,
//     },
//     {
//       propertyid: 2,
//       src: "https://via.placeholder.com/250",
//       property_name: "Urban Apartment",
//       rating: 4.0,
//       address: "456 City St, Downtown",
//       property_type: "Apartment",
//       property_desc: "Modern apartment in the heart of the city.",
//       min_price: 2500,
//       bedroomcount: 2,
//       bedcount: 2,
//       bathroomcount: 1,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Parking"],
//       guest_capacity: 4,
//     },
//     {
//       propertyid: 3,
//       src: "https://via.placeholder.com/250",
//       property_name: "Mountain Cabin Retreat",
//       rating: 4.8,
//       address: "789 Mountain Road, Highlands",
//       property_type: "Home",
//       property_desc: "Cozy cabin surrounded by nature.",
//       min_price: 4000,
//       bedroomcount: 2,
//       bedcount: 2,
//       bathroomcount: 1,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Fireplace"],
//       guest_capacity: 4,
//     },
//     {
//       propertyid: 3,
//       src: "https://via.placeholder.com/250",
//       property_name: "Mountain Cabin Retreat",
//       rating: 4.8,
//       address: "789 Mountain Road, Highlands",
//       property_type: "Home",
//       property_desc: "Cozy cabin surrounded by nature.",
//       min_price: 4000,
//       bedroomcount: 2,
//       bedcount: 2,
//       bathroomcount: 1,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Fireplace"],
//       guest_capacity: 4,
//     },
//     {
//       propertyid: 4,
//       src: "https://via.placeholder.com/250",
//       property_name: "Lakeside Villa",
//       rating: 4.6,
//       address: "101 Lakeside Blvd, Serenity",
//       property_type: "Villa",
//       property_desc: "Spacious villa with a beautiful lakeside view.",
//       min_price: 4500,
//       bedroomcount: 4,
//       bedcount: 4,
//       bathroomcount: 3,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Swimming Pool", "Barbecue"],
//       guest_capacity: 8,
//     },
//     {
//       propertyid: 5,
//       src: "https://via.placeholder.com/250",
//       property_name: "City Loft",
//       rating: 4.2,
//       address: "23 Park Ave, Downtown",
//       property_type: "Loft",
//       property_desc: "Stylish loft in the center of the city.",
//       min_price: 3000,
//       bedroomcount: 1,
//       bedcount: 1,
//       bathroomcount: 1,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Gym"],
//       guest_capacity: 2,
//     },
//     {
//       propertyid: 6,
//       src: "https://via.placeholder.com/250",
//       property_name: "Countryside Bungalow",
//       rating: 4.3,
//       address: "56 Country Lane, Hilltop",
//       property_type: "Bungalow",
//       property_desc: "Charming bungalow with countryside views.",
//       min_price: 3200,
//       bedroomcount: 3,
//       bedcount: 3,
//       bathroomcount: 2,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Garden"],
//       guest_capacity: 6,
//     },
//     {
//       propertyid: 7,
//       src: "https://via.placeholder.com/250",
//       property_name: "Downtown Studio",
//       rating: 4.1,
//       address: "345 Main St, City Center",
//       property_type: "Studio",
//       property_desc: "Cozy studio in the heart of the city.",
//       min_price: 2200,
//       bedroomcount: 1,
//       bedcount: 1,
//       bathroomcount: 1,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Air Conditioning"],
//       guest_capacity: 2,
//     },
//     {
//       propertyid: 8,
//       src: "https://via.placeholder.com/250",
//       property_name: "Seaside Apartment",
//       rating: 4.7,
//       address: "99 Seaside Drive, Bayview",
//       property_type: "Apartment",
//       property_desc: "Modern apartment with panoramic seaside views.",
//       min_price: 5000,
//       bedroomcount: 2,
//       bedcount: 2,
//       bathroomcount: 2,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Balcony"],
//       guest_capacity: 4,
//     },
//     {
//       propertyid: 9,
//       src: "https://via.placeholder.com/250",
//       property_name: "Rustic Mountain Lodge",
//       rating: 4.4,
//       address: "123 Alpine Rd, Mountain Peak",
//       property_type: "Lodge",
//       property_desc: "Rustic lodge with amazing mountain views.",
//       min_price: 3800,
//       bedroomcount: 3,
//       bedcount: 3,
//       bathroomcount: 2,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Fireplace"],
//       guest_capacity: 6,
//     },
//     {
//       propertyid: 7,
//       src: "https://via.placeholder.com/250",
//       property_name: "Downtown Studio",
//       rating: 4.1,
//       address: "345 Main St, City Center",
//       property_type: "Studio",
//       property_desc: "Cozy studio in the heart of the city.",
//       min_price: 2200,
//       bedroomcount: 1,
//       bedcount: 1,
//       bathroomcount: 1,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Air Conditioning"],
//       guest_capacity: 2,
//     },
//     {
//       propertyid: 8,
//       src: "https://via.placeholder.com/250",
//       property_name: "Seaside Apartment",
//       rating: 4.7,
//       address: "99 Seaside Drive, Bayview",
//       property_type: "Apartment",
//       property_desc: "Modern apartment with panoramic seaside views.",
//       min_price: 5000,
//       bedroomcount: 2,
//       bedcount: 2,
//       bathroomcount: 2,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Balcony"],
//       guest_capacity: 4,
//     },
//     {
//       propertyid: 9,
//       src: "https://via.placeholder.com/250",
//       property_name: "Rustic Mountain Lodge",
//       rating: 4.4,
//       address: "123 Alpine Rd, Mountain Peak",
//       property_type: "Lodge",
//       property_desc: "Rustic lodge with amazing mountain views.",
//       min_price: 3800,
//       bedroomcount: 3,
//       bedcount: 3,
//       bathroomcount: 2,
//       bookingoptions: ["Instant Book"],
//       amenities: ["Wifi", "Fireplace"],
//       guest_capacity: 6,
//     }
//   ];
  
//   // Filter the accommodations based on selected filters
//   const filteredAccommodations = dummyAccommodations.filter(accommodation => {
//     const amenityMatch = selectedAmenities.every(amenity =>
//       accommodation.amenities.includes(amenity)
//     );

//     const priceMatch = (!minPrice || accommodation.min_price >= minPrice) &&
//       (!maxPrice || accommodation.min_price <= maxPrice);

//     const bedroomsMatch = bedrooms === 'Any' || accommodation.bedroomcount >= parseInt(bedrooms, 10);
//     const bedsMatch = beds === 'Any' || accommodation.bedcount >= parseInt(beds, 10);
//     const bathroomsMatch = bathrooms === 'Any' || accommodation.bathroomcount >= parseInt(bathrooms, 10);

//     const bookingOptionsMatch = bookingOptions.length === 0 ||
//       bookingOptions.every(option => accommodation.bookingoptions.includes(option));

//     const propertyTypeMatch = propertyTypes.length === 0 || 
//       propertyTypes.includes(accommodation.property_type);
//     const guestCapacityMatch = guestCapacity === null || accommodation.guest_capacity >= parseInt(guestCapacity, 10);

//     return amenityMatch && priceMatch && bedroomsMatch && bedsMatch && bathroomsMatch && bookingOptionsMatch && propertyTypeMatch && guestCapacityMatch;
//   });

//   // Handle the click event to navigate to the property page
//   const handleView = (e, propertyid) => {
//     const queryParams = new URLSearchParams({
//       guestCapacity: searchUpdate.guestCapacity || '',
//       checkin_date: searchUpdate.checkin_date || '',
//       checkout_date: searchUpdate.checkout_date || '',
//     }).toString();

//     console.log("Query Params:", queryParams);
//     navigate(`/accommodation/property/${propertyid}?${queryParams}`);
//   };

//   // Set loading state and delay before showing accommodations
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setLoading(false); // Set loading to false after dummy data is loaded
//     }, 1000); // Simulating delay

//     return () => clearTimeout(delay); // Cleanup if component is unmounted
//   }, []);


  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 9;
  
  // // Function to handle page change
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // // Calculate which items to display based on the current page
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredAccommodations.slice(indexOfFirstItem, indexOfLastItem);
  

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
    navigate(`/accommodation/property/${propertyid}?${queryParams}`);
  };
  

  useEffect(() => {
    // Add delay before setting loading to false
    if(filteredAccommodations.length > 0 || accommodations.length > 0) {
      setLoading(false);
    }

    // return () => clearTimeout(delay); // Cleanup function
  }, [filteredAccommodations, accommodations]); // Run only on component mount

  
  // Dummy data for accommodations
  const dummyAccommodations = [
    {
      propertyid: 1,
      src: "https://via.placeholder.com/250",
      property_name: "Sunset Beach House",
      rating: 4.5,
      address: "123 Ocean Drive, Beach City",
      property_type: "Home",
      property_desc: "A beautiful beach house with a stunning view of the ocean.",
      min_price: 3500,
      bedroomcount: 3,
      bedcount: 3,
      bathroomcount: 2,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Air Conditioning"],
      guest_capacity: 6,
    },
    {
      propertyid: 2,
      src: "https://via.placeholder.com/250",
      property_name: "Urban Apartment",
      rating: 4.0,
      address: "456 City St, Downtown",
      property_type: "Apartment",
      property_desc: "Modern apartment in the heart of the city.",
      min_price: 2500,
      bedroomcount: 2,
      bedcount: 2,
      bathroomcount: 1,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Parking"],
      guest_capacity: 4,
    },
    {
      propertyid: 3,
      src: "https://via.placeholder.com/250",
      property_name: "Mountain Cabin Retreat",
      rating: 4.8,
      address: "789 Mountain Road, Highlands",
      property_type: "Home",
      property_desc: "Cozy cabin surrounded by nature.",
      min_price: 4000,
      bedroomcount: 2,
      bedcount: 2,
      bathroomcount: 1,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Fireplace"],
      guest_capacity: 4,
    },
    {
      propertyid: 3,
      src: "https://via.placeholder.com/250",
      property_name: "Mountain Cabin Retreat",
      rating: 4.8,
      address: "789 Mountain Road, Highlands",
      property_type: "Home",
      property_desc: "Cozy cabin surrounded by nature.",
      min_price: 4000,
      bedroomcount: 2,
      bedcount: 2,
      bathroomcount: 1,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Fireplace"],
      guest_capacity: 4,
    },
    {
      propertyid: 4,
      src: "https://via.placeholder.com/250",
      property_name: "Lakeside Villa",
      rating: 4.6,
      address: "101 Lakeside Blvd, Serenity",
      property_type: "Villa",
      property_desc: "Spacious villa with a beautiful lakeside view.",
      min_price: 4500,
      bedroomcount: 4,
      bedcount: 4,
      bathroomcount: 3,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Swimming Pool", "Barbecue"],
      guest_capacity: 8,
    },
    {
      propertyid: 5,
      src: "https://via.placeholder.com/250",
      property_name: "City Loft",
      rating: 4.2,
      address: "23 Park Ave, Downtown",
      property_type: "Loft",
      property_desc: "Stylish loft in the center of the city.",
      min_price: 3000,
      bedroomcount: 1,
      bedcount: 1,
      bathroomcount: 1,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Gym"],
      guest_capacity: 2,
    },
    {
      propertyid: 6,
      src: "https://via.placeholder.com/250",
      property_name: "Countryside Bungalow",
      rating: 4.3,
      address: "56 Country Lane, Hilltop",
      property_type: "Bungalow",
      property_desc: "Charming bungalow with countryside views.",
      min_price: 3200,
      bedroomcount: 3,
      bedcount: 3,
      bathroomcount: 2,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Garden"],
      guest_capacity: 6,
    },
    {
      propertyid: 7,
      src: "https://via.placeholder.com/250",
      property_name: "Downtown Studio",
      rating: 4.1,
      address: "345 Main St, City Center",
      property_type: "Studio",
      property_desc: "Cozy studio in the heart of the city.",
      min_price: 2200,
      bedroomcount: 1,
      bedcount: 1,
      bathroomcount: 1,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Air Conditioning"],
      guest_capacity: 2,
    },
    {
      propertyid: 8,
      src: "https://via.placeholder.com/250",
      property_name: "Seaside Apartment",
      rating: 4.7,
      address: "99 Seaside Drive, Bayview",
      property_type: "Apartment",
      property_desc: "Modern apartment with panoramic seaside views.",
      min_price: 5000,
      bedroomcount: 2,
      bedcount: 2,
      bathroomcount: 2,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Balcony"],
      guest_capacity: 4,
    },
    {
      propertyid: 9,
      src: "https://via.placeholder.com/250",
      property_name: "Rustic Mountain Lodge",
      rating: 4.4,
      address: "123 Alpine Rd, Mountain Peak",
      property_type: "Lodge",
      property_desc: "Rustic lodge with amazing mountain views.",
      min_price: 3800,
      bedroomcount: 3,
      bedcount: 3,
      bathroomcount: 2,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Fireplace"],
      guest_capacity: 6,
    },
    {
      propertyid: 7,
      src: "https://via.placeholder.com/250",
      property_name: "Downtown Studio",
      rating: 4.1,
      address: "345 Main St, City Center",
      property_type: "Studio",
      property_desc: "Cozy studio in the heart of the city.",
      min_price: 2200,
      bedroomcount: 1,
      bedcount: 1,
      bathroomcount: 1,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Air Conditioning"],
      guest_capacity: 2,
    },
    {
      propertyid: 8,
      src: "https://via.placeholder.com/250",
      property_name: "Seaside Apartment",
      rating: 4.7,
      address: "99 Seaside Drive, Bayview",
      property_type: "Apartment",
      property_desc: "Modern apartment with panoramic seaside views.",
      min_price: 5000,
      bedroomcount: 2,
      bedcount: 2,
      bathroomcount: 2,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Balcony"],
      guest_capacity: 4,
    },
    {
      propertyid: 9,
      src: "https://via.placeholder.com/250",
      property_name: "Rustic Mountain Lodge",
      rating: 4.4,
      address: "123 Alpine Rd, Mountain Peak",
      property_type: "Lodge",
      property_desc: "Rustic lodge with amazing mountain views.",
      min_price: 3800,
      bedroomcount: 3,
      bedcount: 3,
      bathroomcount: 2,
      bookingoptions: ["Instant Book"],
      amenities: ["Wifi", "Fireplace"],
      guest_capacity: 6,
    }
  ];
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate which items to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccommodations.slice(indexOfFirstItem, indexOfLastItem);


  console.log("SEARCH UPDATE FROM MAIN",searchUpdate );

  return (
<div className="all-container">
  <div className="content-container">
    <div
      className="main-content"
       style={{
        marginLeft:'0.8rem',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  }}
    >
      {loading ? (
        Array(9)
          .fill()
          .map((_, index) => <Loader key={index} />)
      ) : filteredAccommodations.length === 0 ? (
        <div 
          className="no-results-message" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center', 
            padding: '2rem',
          marginTop:'-0.1rem'     }}
        >
          <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>No available accommodations found</h2>
          <p style={{ fontSize: '1rem', margin: '0.5rem 0' }}>Please adjust your filters to find suitable options.</p>
        </div>
      ) : (
      
        currentItems.map((accommodation, index) => (
          <div
            className="card"
            key={index}
            style={{
              width: 'calc(33.33% - 1rem)', // Default for larger screens
              margin: '0.5rem',
              marginTop:'-.1px',
              marginBottom:'1rem',
              minWidth: '250px', // Set minimum width to handle very small screens
              boxSizing: 'border-box',
              justifyContent:'flex-start'
            }}
            onClick={(e) => handleView(e, accommodation.propertyid)}
          >
            <div className="card-img">
              <img src={accommodation.src} alt={accommodation.property_name} />
            </div>
            <div className="card-info">
              <div className="card-title" style={{ margin: '0px' }}>
                <p className="text-title" style={{ fontSize: '1rem' }}>
                  {accommodation.property_name}
                </p>
                {/* Star rating */}
                <div style={{ fontSize: '0.9rem' }}>
                  <span>★</span>
                  <span>{accommodation.rating}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', margin: '0px' }}>
                <LocationOnIcon
                  style={{
                    marginRight: '2px',
                    fontSize: '1rem',
                    margin: '0px',
                    padding: '0px',
                    opacity: '0.9',
                  }}
                />
                <p
                  style={{
                    fontSize: '0.8rem',
                    margin: '0px',
                    opacity: '0.9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {accommodation.address}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', margin: '0px' }}>
                {(accommodation.property_type === 'Home' ||
                accommodation.property_type === 'Apartment') ? (
                  <HomeOutlinedIcon
                    style={{
                      marginRight: '2px',
                      fontSize: '1rem',
                      margin: '0px',
                      padding: '0px',
                      opacity: '0.9',
                    }}
                  />
                ) : (
                  <ApartmentIcon
                    style={{
                      marginRight: '2px',
                      fontSize: '1rem',
                      margin: '0px',
                      padding: '0px',
                      opacity: '0.9',
                    }}
                  />
                )}
                <p
                  style={{
                    fontSize: '0.8rem',
                    margin: '0px',
                    opacity: '0.9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {accommodation.property_type}
                </p>
              </div>
              <p
                className="text-muted-foreground mb-1"
                style={{
                  fontSize: '0.8rem',
                  margin: '0px',
                  opacity: '0.6',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontStyle: 'italic',
                }}
              >
                {accommodation.property_desc}
              </p>
            </div>
            <div className="card-footerr">
              <span
                className="text-title"
                style={{
                  fontSize: '0.8rem',
                  backgroundColor: '#A334CF',
                  color: 'white',
                  padding: '5px',
                  borderRadius: '4px',
                  marginTop: '5px',
                }}
              >
                {'₱ ' + (accommodation.min_price ? accommodation.min_price : 'N/A')} night
              </span>
            </div>
          </div>
        ))  
      )}


    </div>
    <div
  className="pagination"
  style={{
    marginTop: '20px',
    marginBottom: '10px',
    display: 'flex',           // Added to create a flex container
    justifyContent: 'center',  // Centers the pagination buttons horizontally
    alignItems: 'center',      // Optional: Vertically align the buttons (if needed)
  }}
>
  {Array.from({ length: Math.ceil(filteredAccommodations.length / itemsPerPage) }, (_, index) => (
    <button
      key={index}
      onClick={() => paginate(index + 1)}
      style={{
        padding: '10px',
        margin: '0 5px',
        borderRadius: '5px',
        backgroundColor: currentPage === index + 1 ? '#A334CF' : '#e0e0e0',
        color: currentPage === index + 1 ? 'white' : '#333',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {index + 1}
    </button>
  ))}
</div>

  </div>
  
</div>



  );
};

export default MainContent;

