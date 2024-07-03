
import React, { useState, useEffect } from 'react';
import './MainContent.css';
import { MdForward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Loader from './loader';

const MainContent = ({
  selectedAmenities = [],
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
  const [loading, setLoading] = useState(true); // Set loading state initially to true
  const [properties, setProperties] = useState([]);
  const [availableProperties, setAvailableProperties] = useState([]);
  const navigate = useNavigate();
  const { minPrice, maxPrice, bedrooms, beds, bathrooms, bookingOptions, propertyTypes } = filters;
  const [checkin_date, setCheckin_date] = useState(null);
  const [checkout_date, setCheckout_date] = useState(null);

  // Dummy data for accommodations
  const dummyAccommodations = [
    {
      propertyid: 1,
      property_name: "Luxury Villa",
      property_desc: "A beautiful luxury villa with stunning views.",
      amenities: ["Pool", "Wi-Fi", "Aircon", "Gym", "Sauna"],
      bedroomcount: 3,
      bedcount: 4,
      bathroomcount: 2,
      booking_options: ["Instant Booking", "Free Cancellation"],
      property_type: "Home",
      guest_capacity: 6,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 2,
      property_name: "Cozy Apartment",
      property_desc: "A cozy apartment in the city center.",
      amenities: ["Wi-Fi", "Heating", "Washer", "Dryer"],
      bedroomcount: 2,
      bedcount: 2,
      bathroomcount: 1,
      booking_options: ["Request to Book", "Flexible Dates"],
      property_type: "Apartment",
      guest_capacity: 4,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 3,
      property_name: "Modern Condo",
      property_desc: "A modern condo with all amenities.",
      amenities: ["Wi-Fi", "Heating", "Parking", "Elevator"],
      bedroomcount: 2,
      bedcount: 2,
      bathroomcount: 1,
      booking_options: ["Request to Book", "Instant Booking"],
      property_type: "Condo",
      guest_capacity: 4,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 4,
      property_name: "Beach House",
      property_desc: "A stunning beach house with ocean views.",
      amenities: ["Wi-Fi", "Pool", "Beach Access", "BBQ Grill"],
      bedroomcount: 4,
      bedcount: 5,
      bathroomcount: 3,
      booking_options: ["Instant Booking", "Free Cancellation"],
      property_type: "House",
      guest_capacity: 8,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 5,
      property_name: "Mountain Cabin",
      property_desc: "A cozy cabin in the mountains.",
      amenities: ["Wi-Fi", "Fireplace", "Hot Tub", "Pet Friendly"],
      bedroomcount: 3,
      bedcount: 3,
      bathroomcount: 2,
      booking_options: ["Request to Book", "Flexible Dates"],
      property_type: "Cabin",
      guest_capacity: 6,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 6,
      property_name: "Downtown Loft",
      property_desc: "A stylish loft in the heart of downtown.",
      amenities: ["Wi-Fi", "Heating", "Parking", "Gym"],
      bedroomcount: 1,
      bedcount: 1,
      bathroomcount: 1,
      booking_options: ["Instant Booking", "Free Cancellation"],
      property_type: "Loft",
      guest_capacity: 2,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 7,
      property_name: "Country Cottage",
      property_desc: "A charming cottage in the countryside.",
      amenities: ["Wi-Fi", "Fireplace", "Garden", "Pet Friendly"],
      bedroomcount: 2,
      bedcount: 2,
      bathroomcount: 1,
      booking_options: ["Request to Book", "Flexible Dates"],
      property_type: "Cottage",
      guest_capacity: 4,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 8,
      property_name: "Urban Studio",
      property_desc: "A compact studio in a vibrant urban area.",
      amenities: ["Wi-Fi", "Heating", "Aircon", "Elevator"],
      bedroomcount: 1,
      bedcount: 1,
      bathroomcount: 1,
      booking_options: ["Instant Booking", "Free Cancellation"],
      property_type: "Studio",
      guest_capacity: 2,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 9,
      property_name: "Suburban House",
      property_desc: "A spacious house in a quiet suburb.",
      amenities: ["Wi-Fi", "Pool", "Garage", "BBQ Grill"],
      bedroomcount: 4,
      bedcount: 5,
      bathroomcount: 3,
      booking_options: ["Request to Book", "Flexible Dates"],
      property_type: "House",
      guest_capacity: 8,
      src: "https://via.placeholder.com/300" // Placeholder image
    },
    {
      propertyid: 10,
      property_name: "Lakefront Villa",
      property_desc: "A luxurious villa by the lake.",
      amenities: ["Wi-Fi", "Pool", "Lake Access", "BBQ Grill"],
      bedroomcount: 5,
      bedcount: 6,
      bathroomcount: 4,
      booking_options: ["Instant Booking", "Free Cancellation"],
      property_type: "Villa",
      guest_capacity: 10,
      src: "https://via.placeholder.com/300" // Placeholder image
    }
  ];
  
  const dummyPricingList = [
    { propertyid: 1, min_price: 5000 },
    { propertyid: 2, min_price: 3000 },
    { propertyid: 3, min_price: 4000 },
    { propertyid: 4, min_price: 7000 },
    { propertyid: 5, min_price: 4500 },
    { propertyid: 6, min_price: 3500 },
    { propertyid: 7, min_price: 4000 },
    { propertyid: 8, min_price: 2500 },
    { propertyid: 9, min_price: 6000 },
    { propertyid: 10, min_price: 8000 }
  ];
  
  const filteredAccommodations = dummyAccommodations.filter(accommodation => {
    const amenityMatch = selectedAmenities.every(amenity =>
      accommodation.amenities.includes(amenity)
    );

    const priceInfo = dummyPricingList.find(price => price.propertyid === accommodation.propertyid);
    const priceMatch = priceInfo &&
      (!minPrice || priceInfo.min_price >= minPrice) &&
      (!maxPrice || priceInfo.min_price <= maxPrice);
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
    const delay = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(delay); // Cleanup function
  }, []); // Run only on component mount

  return (
    <div className="all-container">
      <div className="content-container" style={{ marginBottom: '76rem' }}>
        <div className="main-content" style={{ marginLeft: '2.3rem', display: 'flex', flexWrap: 'wrap' }}>
          {loading ? (
            filteredAccommodations.map((_, index) => <Loader key={index} />)
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
                  <span className="text-title" style={{ fontSize: '0.8rem', backgroundColor:'#A334CF', color:'white', padding:'5px', borderRadius:'4px', marginTop:'5px' }}>{"$" + (dummyPricingList.find(price => price.propertyid === accommodation.propertyid)?.min_price || 'N/A')} night</span>
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


// import React, { useState, useEffect } from 'react';
// import './MainContent.css';
// import { useNavigate } from 'react-router-dom';
// import Loader from './loader';

// const MainContent = ({
//   selectedAmenities = [],
//   accommodations = [],
//   filters = {
//     minPrice: null,
//     maxPrice: null,
//     bedrooms: 'Any',
//     beds: 'Any',
//     bathrooms: 'Any',
//     bookingOptions: [],
//     propertyTypes: [] // Added property types
//   },
//   pricinglist = [],
//   searchData,
//   setSearchData
// }) => {
//   const [selectedPropertyType, setSelectedPropertyType] = useState('Any');
//   const [guestCapacity, setGuestCapacity] = useState(null);
//   const [availability, setAvailability] = useState({ startDate: null, endDate: null });
//   const [loading, setLoading] = useState(true); // Set loading state initially to true
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { minPrice, maxPrice, bedrooms, beds, bathrooms, bookingOptions, propertyTypes } = filters;
//   const [checkin_date, setCheckin_date] = useState(null);
//   const [checkout_date, setCheckout_date] = useState(null);

//   // Filter accommodations based on all criteria
//   const filteredAccommodations = accommodations.filter(accommodation => {
//     const amenityMatch = selectedAmenities.every(amenity =>
//       accommodation.amenities.includes(amenity)
//     );

//     const priceInfo = pricinglist.find(price => price.propertyid === accommodation.propertyid);
//     const priceMatch = priceInfo &&
//       (!minPrice || priceInfo.min_price >= minPrice) &&
//       (!maxPrice || priceInfo.min_price <= maxPrice);
//     const bedroomsMatch = bedrooms === 'Any' || accommodation.bedroomcount >= parseInt(bedrooms, 10);
//     const bedsMatch = beds === 'Any' || accommodation.bedcount >= parseInt(beds, 10);
//     const bathroomsMatch = bathrooms === 'Any' || accommodation.bathroomcount >= parseInt(bathrooms, 10);

//     const bookingOptionsMatch = bookingOptions.length === 0 ||
//       bookingOptions.every(option => accommodation.booking_options.includes(option));

//     const propertyTypeMatch = propertyTypes.length === 0 ||
//       propertyTypes.includes(accommodation.property_type);
//     const guestCapacityMatch = guestCapacity === null || accommodation.guest_capacity >= parseInt(guestCapacity, 10);

//     return amenityMatch && priceMatch && bedroomsMatch && bedsMatch && bathroomsMatch && bookingOptionsMatch && propertyTypeMatch && guestCapacityMatch;
//   });

//   const handleView = (e, propertyid) => {
//     const state = {
//       guestCapacity,
//       checkin_date,
//       checkout_date
//     };
//     navigate(`/accommodation/property/${propertyid}`, { state });
//   };

//   useEffect(() => {
//     // Add delay before setting loading to false
//     const delay = setTimeout(() => {
//       setLoading(false);
//     }, 1000); // 1 second delay

//     return () => clearTimeout(delay); // Cleanup function
//   }, []); // Run only on component mount

//   return (
//     <div className="all-container">
//       <div className="content-container" style={{ marginBottom: '63rem' }}>
//         <div className="main-content" style={{ marginLeft: '2.3rem', display: 'flex', flexWrap: 'wrap' }}>
//           {loading ? (
//             filteredAccommodations.map((_, index) => <Loader key={index} />)
//           ) : (
//             filteredAccommodations.map((accommodation, index) => (
//               <div className="card" key={index} style={{ width: 'calc(33.33% - 1rem)', margin: '0.5rem' }} onClick={(e) => handleView(e, accommodation.propertyid)}>
//                 <div className="card-img">
//                   <img src={accommodation.src} alt={accommodation.property_name} />
//                 </div>
//                 <div className="card-info">
//                   <div className="flex justify-between items-center mb-1" style={{ margin: '0px' }}>
//                     <p className="text-title" style={{ fontSize: '1rem' }}>{accommodation.property_name}</p>
//                     {/* Star rating (dummy) */}
//                     <div className="flex items-center">
//                       <span className="text-yellow-500">★</span>
//                       <span className="text-muted-foreground ml-1">4.5</span>
//                     </div>
//                   </div>
//                   <p className="text-body" style={{ fontSize: '0.8rem', margin: '0px' }}>{accommodation.address}</p>
//                   <p className="text-body" style={{ fontSize: '0.8rem', margin: '0px' }}>{accommodation.bedroomcount} Bedrooms | {accommodation.bathroomcount} Bathrooms</p>
//                   <p className="text-body" style={{ fontSize: '0.8rem', margin: '0px' }}>Maximum Guests: {accommodation.guest_capacity}</p>
//                   <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span className="text-title" style={{ fontSize: '0.9rem' }}>From ${accommodation.min_price} per night</span>
//                     <span className="text-muted-foreground" style={{ fontSize: '0.8rem' }}>More details</span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainContent;
