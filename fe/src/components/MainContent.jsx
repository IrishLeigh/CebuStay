// MainContent.jsx
import React, { useState, useEffect } from 'react';
import './MainContent.css';
import Search from './Search';
import { MdForward } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


// export const accommodationlist = [
//   {
//       "propertyid": 59,
//       "property_name": "GardenLudi",
//       "property_desc": "Elahang Ludi sa Lacion",
//       "property_type": "Home",
//       "unit_type": "Private room",
//       "src": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/418124699.jpg?k=ab5255aeec58442350af38e5b820c038390fecda205a5f19ca0973cf97a6d6bf&o=&hp=1",
//       "guest_capacity": 2,
//       "bedroomcount": 1,
//       "bathroomcount": 3,
//       "bedcount": 2,
//       "amenities": ["Wi-Fi", "TV"],
//       "booking_options":["Allows Pets", "Instant Book", "Instant Book"]

//   },

//   {
//     "propertyid": 59,
//     "property_name": "GardenBert",
//     "property_desc": "Elahang Robert sa Tisa",
//     "property_type": "Homestay",
//     "unit_type": "Private room",
//     "src": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/418124699.jpg?k=ab5255aeec58442350af38e5b820c038390fecda205a5f19ca0973cf97a6d6bf&o=&hp=1",
//     "guest_capacity": 3,
//     "bedroomcount": 2,
//     "bathroomcount": 2,
//     "bedcount": 4,
//     "amenities": ["Wi-Fi", "TV", "Breakfast"],
//     "booking_options":["Allows Pets", "Self Check-in", "Instant Book"]

// },
// {
//     "propertyid": 61,
//     "property_name": "GardenRhad",
//     "property_desc": "Elahang Rhad sa Bantayan",
//     "property_type": "Hotel",
//     "unit_type": "Private room",
//     "src": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/418124699.jpg?k=ab5255aeec58442350af38e5b820c038390fecda205a5f19ca0973cf97a6d6bf&o=&hp=1",
//     "guest_capacity": 2,
//     "bedroomcount": 1,
//     "bathroomcount": 4,
//     "bedcount": 2,
//     "amenities": ["Wi-Fi", "Fitness Center", "Kitchen"],
//     "booking_options":["Allows Pets", "Instant Book", "Self Check-in", "Instant Book"]

// },

// {
//     "propertyid": 62,
//     "property_name": "GardenKat",
//     "property_desc": "Elahang Kat sa Algeria",
//     "property_type": "Home",
//     "unit_type": "Private room",
//     "src": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/418124699.jpg?k=ab5255aeec58442350af38e5b820c038390fecda205a5f19ca0973cf97a6d6bf&o=&hp=1",
//     "guest_capacity": 3,
//     "bedroomcount": 3,
//     "bathroomcount": 2,
//     "bedcount": 3,
//     "amenities": ["Wi-Fi", "TV", "Kitchen"],
//     "booking_options":["Instant Book", "Free Cancellation"]

// },

// {
//   "propertyid": 1,
//   "property_name": "GardenGen",
//   "property_desc": "Elahang Kat sa Algeria",
//   "property_type": "Home",
//   "unit_type": "Private room",
//   "src": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/418124699.jpg?k=ab5255aeec58442350af38e5b820c038390fecda205a5f19ca0973cf97a6d6bf&o=&hp=1",
//   "guest_capacity": 3,
//   "bedroomcount": 3,
//   "bathroomcount": 2,
//   "bedcount": 3,
//   "amenities": ["Wi-Fi", "Spa", "Parking"],
//   "booking_options":["Self Check-in", "Free Cancellation"]

// },

// {
//   "propertyid": 2,
//   "property_name": "GardenAl",
//   "property_desc": "Elahang Kat sa Algeria",
//   "property_type": "Home",
//   "unit_type": "Private room",
//   "src": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/418124699.jpg?k=ab5255aeec58442350af38e5b820c038390fecda205a5f19ca0973cf97a6d6bf&o=&hp=1",
//   "guest_capacity": 3,
//   "bedroomcount": 3,
//   "bathroomcount": 2,
//   "bedcount": 3,
//   "amenities": ["Wi-Fi", "TV", "Parking", "Fitness Center", "Breakfast"],
//   "booking_options":["Free Cancellation", "Instant Book", "Self Check-in", "Allows Pets"]

// },
// {
//   "propertyid": 3,
//   "property_name": "GardenPhoebe",
//   "property_desc": "Elahang Kat sa Algeria",
//   "property_type": "Home",
//   "unit_type": "Private room",
//   "src": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/418124699.jpg?k=ab5255aeec58442350af38e5b820c038390fecda205a5f19ca0973cf97a6d6bf&o=&hp=1",
//   "guest_capacity": 4,
//   "bedroomcount": 3,
//   "bathroomcount": 2,
//   "bedcount": 3,
//   "amenities": ["Wi-Fi", "TV", "Spa"],
//   "booking_options":["Allows Pets", "Instant Book"]
// },
// {
//     "propertyid": 63,
//     "property_name": "GardenRish",
//     "property_desc": "Elahang Irish sa Cebu",
//     "property_type": "Apartment",
//     "unit_type": "Private room",
//     "src": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/418124699.jpg?k=ab5255aeec58442350af38e5b820c038390fecda205a5f19ca0973cf97a6d6bf&o=&hp=1",
//     "guest_capacity": 5,
//     "bedroomcount": 3,
//     "bathroomcount": 1,
//     "bedcount": 5,
//     "amenities": ["Wi-Fi", "TV", "Fitness Center"],
//     "booking_options":["Self Check-in", "Instant Book"]
// }
// ];

// export const pricinglist =[
//   {
//       "proppricingid": 9,
//       "max_price": 1000,
//       "min_price": 500,
//       "profit": 300,
//       "homeid": 25,
//       "propertyid": 59
//   },
//   {
//     "proppricingid": 9,
//     "max_price": 1000,
//     "min_price": 500,
//     "profit": 300,
//     "homeid": 25,
//     "propertyid": 61
// },
//   {
//     "proppricingid": 9,
//     "max_price": 1000,
//     "min_price": 500,
//     "profit": 300,
//     "homeid": 25,
//     "propertyid": 63
// },
//   {
//       "proppricingid": 10,
//       "max_price": 1500,
//       "min_price": 1000,
//       "profit": 450,
//       "homeid": 26,
//       "propertyid": 60
//   },
//   {
//       "proppricingid": 11,
//       "max_price": 1750,
//       "min_price": 1250,
//       "profit": 600,
//       "homeid": 27,
//       "propertyid": 3
//   },
//   {
//       "proppricingid": 12,
//       "max_price": 5000,
//       "min_price": 10000,
//       "profit": 750,
//       "homeid": 28,
//       "propertyid": 1
//   },
//   {
//       "proppricingid": 13,
//       "max_price": 2250,
//       "min_price": 1750,
//       "profit": 1000,
//       "homeid": 29,
//       "propertyid": 2
//   }
// ];


const MainContent = ({ selectedAmenities = [],
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
  const{propertyid} = useParams();
  const  navigate = useNavigate();

  

  const { minPrice, maxPrice,bedrooms, beds, bathrooms, bookingOptions } = filters;

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

  const handlePropertyTypeClick = (type) => {
    setSelectedPropertyType(type);
  };

    const handleView = (e, propertyid) => {
      // alert('Propertyid: ' + propertyid);
      navigate(`/accommodation/property/${propertyid}`);
      console.log('Propertyid: ' + propertyid);
      
      //INSERT REDIRECT TO VIEW PROPERTY HERE
    };

    const handleSearch = ({ guestCapacity }) => {
      setGuestCapacity(guestCapacity);
    };
    
    useEffect(() => {
      const acc = filteredAccommodations
      console.log(acc)
    }, [])
  return (
    <div className="all-container">
  <Search onSearch={handleSearch} />    
  <div className="filter-buttons" style={{marginLeft:'4.5rem'}}>
      <button className="btn-shiny2" 
              
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16B4DD'}
              onClick={() => handlePropertyTypeClick('Home')}
              >
              Home
          </button>
          <button className="btn-shiny4" 
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ADC939'}
              onClick={() => handlePropertyTypeClick('Hotel')}>
              Hotel
          </button>
          <button className="btn-shiny5" 
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#F9CC41'}
              onClick={() => handlePropertyTypeClick('Homestay')}>
              Homestay
          </button>
          <button className="btn-shiny6" 
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#EE414B'}
              onClick={() => handlePropertyTypeClick('Apartment')}>
              Apartment
          </button>
          <button className="btn-shiny7" 
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16B4DD'}
              onClick={() => handlePropertyTypeClick('Any')}>
              Others
          </button>

        {/* Add other filter buttons here */}
      </div>
      <div className="content-container" style={{ marginBottom: '63rem' }}>
        <div className="main-content" style={{ marginLeft: '2.3rem', display: 'flex', flexWrap: 'wrap' }}>
          {filteredAccommodations.map((accommodation, index) => (
            <div className="card" key={index} style={{ width: 'calc(33.33% - 1rem)', margin: '0.5rem' }} onClick={(e) => handleView(e, accommodation.propertyid)} >
              <div className="card-img">
                <img src={accommodation.src} alt={accommodation.property_name} />
              </div>
              <div className="card-info"> 
                <p className="text-title">{accommodation.property_name}</p>
                <p className="text-body">{accommodation.address}</p>
              </div>
              <div className="card-footer">
                <span className="text-title">{"₱" + accommodation.min_price}</span>
                <div className="card-button" >
                  <MdForward />
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
