// // import React, { useState } from 'react';
// // import './PropertyListUI.css';
// // import { accommodationlist, pricinglist } from './components/MainContent';
// // import SideBar from './components/SideBar';
// // import MainContent from './components/MainContent';
// // import axios from 'axios';
// // import { useEffect } from 'react';
// // import { Container } from '@mui/material';
// // import SortMenu from './components/SortMenu';
// // import BannerOffers from './components/BannerOffers';


// // const PropertyListUI = () => {
// //   const [filters, setFilters] = useState({
// //     bedrooms: 'Any',
// //     beds: 'Any',
// //     bathrooms: 'Any',
// //     minPrice: '',
// //     maxPrice: '',
// //     bookingOptions: []
// //   });
// //   const [searchData, setSearchData] = useState({
// //     destination: '',
// //     startDate: new Date(),
// //     endDate: null,
// //     guestCapacity: '',
// // });
// //   const [selectedAmenities, setSelectedAmenities] = useState([]);
// //   const [accommodationlist, setAccommodationlist] = useState([]);
// //   const [pricinglist, setPricinglist] = useState([]);

// // useEffect(() => {
// //   const fetchProperties = async () => {
// //     try {
// //       const response = await axios.get('http://127.0.0.1:8000/api/allproperties');
// //       const properties = response.data;

// //       // Fetch images
// //       const imglist = await axios.get('http://127.0.0.1:8000/api/getallfirstimg');
// //       const imgMap = new Map();
// //       imglist.data.forEach(img => {
// //         imgMap.set(img.propertyid, img.src);
// //       });

// //       // Fetch amenities
// //       const amenityres = await axios.get('http://127.0.0.1:8000/api/getamenities');
// //       const amenityMap = new Map();
// //       if (amenityres.data.status === 'success') {
// //         amenityres.data.data.forEach(amenity => {
// //           if (!amenityMap.has(amenity.propertyid)) {
// //             amenityMap.set(amenity.propertyid, []);
// //           }
// //           amenityMap.get(amenity.propertyid).push(amenity.amenity_name);
// //         });
// //       }

// //       // Fetch pricing
// //       const pricingres = await axios.get('http://127.0.0.1:8000/api/allpropertypricing');
// //       const pricingMap = new Map();
// //       if (pricingres.data.status === 'success') {
// //         pricingres.data.pricings.forEach(pricing => {
// //           pricingMap.set(pricing.propertyid, pricing.min_price);
// //         });
// //         setPricinglist(pricingres.data.pricings);
// //       }

// //       // Fetch locations
// //       const locres = await axios.get('http://127.0.0.1:8000/api/getlocations');
// //       const locMap = new Map();
// //       if (locres.data.status === 'success') {
// //         locres.data.data.forEach(location => {
// //           locMap.set(location.propertyid, location.address);
// //         });
// //       }

// //       // Update properties with images, amenities, min_price, and address
// //       const updatedList = properties.map(property => ({
// //         ...property,
// //         src: imgMap.get(property.propertyid) || null, // Set image source if available
// //         amenities: amenityMap.get(property.propertyid) || [], // Set amenities if available
// //         min_price: pricingMap.get(property.propertyid) || null, // Set min_price if available
// //         address: locMap.get(property.propertyid) || null // Set address if available
// //       }));

// //       setAccommodationlist(updatedList);
// //       console.log('Accommodation list with images, amenities, prices, and addresses:', updatedList);
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   fetchProperties();
// // }, []);
  

// //   const handleFilterChange = (newFilters) => {
// //     setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
// //   };

// //   const handleAmenityChange = (amenities) => {
// //     setSelectedAmenities(amenities);
// //   };

// //   return (
// //     <Container maxWidth="lg">
// //       <BannerOffers/>
// //       <SortMenu/>
// //       <SideBar onAmenityChange={handleAmenityChange} onFilterChange={handleFilterChange} filters={filters} />
// //       <MainContent selectedAmenities={selectedAmenities} accommodations={accommodationlist} filters={filters} pricinglist={pricinglist} searchData={searchData} setSearchData={setSearchData} />
// //     </Container>
// //   );
// // };

// // export default PropertyListUI;

// import React, { useState, useEffect } from 'react';
// import './PropertyListUI.css';
// import { accommodationlist, pricinglist } from './components/MainContent';
// import SideBar from './components/SideBar';
// import MainContent from './components/MainContent';
// import axios from 'axios';
// import { Container } from '@mui/material';
// import SortMenu from './components/SortMenu';
// import BannerOffers from './components/BannerOffers';

// const PropertyListUI = () => {
//   const [filters, setFilters] = useState({
//     bedrooms: 'Any',
//     beds: 'Any',
//     bathrooms: 'Any',
//     minPrice: '',
//     maxPrice: '',
//     bookingOptions: []
//   });
//   const [searchData, setSearchData] = useState({
//     destination: '',
//     startDate: new Date(),
//     endDate: null,
//     guestCapacity: '',
//   });
//   const [selectedAmenities, setSelectedAmenities] = useState([]);
//   const [accommodationlist, setAccommodationlist] = useState([]);
//   const [pricinglist, setPricinglist] = useState([]);

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/allproperties');
//         const properties = response.data;

//         // Fetch images
//         const imglist = await axios.get('http://127.0.0.1:8000/api/getallfirstimg');
//         const imgMap = new Map();
//         imglist.data.forEach(img => {
//           imgMap.set(img.propertyid, img.src);
//         });

//         // Fetch amenities
//         const amenityres = await axios.get('http://127.0.0.1:8000/api/getamenities');
//         const amenityMap = new Map();
//         if (amenityres.data.status === 'success') {
//           amenityres.data.data.forEach(amenity => {
//             if (!amenityMap.has(amenity.propertyid)) {
//               amenityMap.set(amenity.propertyid, []);
//             }
//             amenityMap.get(amenity.propertyid).push(amenity.amenity_name);
//           });
//         }

//         // Fetch pricing
//         const pricingres = await axios.get('http://127.0.0.1:8000/api/allpropertypricing');
//         const pricingMap = new Map();
//         if (pricingres.data.status === 'success') {
//           pricingres.data.pricings.forEach(pricing => {
//             pricingMap.set(pricing.propertyid, pricing.min_price);
//           });
//           setPricinglist(pricingres.data.pricings);
//         }

//         // Fetch locations
//         const locres = await axios.get('http://127.0.0.1:8000/api/getlocations');
//         const locMap = new Map();
//         if (locres.data.status === 'success') {
//           locres.data.data.forEach(location => {
//             locMap.set(location.propertyid, location.address);
//           });
//         }

//         // Update properties with images, amenities, min_price, and address
//         const updatedList = properties.map(property => ({
//           ...property,
//           src: imgMap.get(property.propertyid) || null, // Set image source if available
//           amenities: amenityMap.get(property.propertyid) || [], // Set amenities if available
//           min_price: pricingMap.get(property.propertyid) || null, // Set min_price if available
//           address: locMap.get(property.propertyid) || null // Set address if available
//         }));

//         setAccommodationlist(updatedList);
//         console.log('Accommodation list with images, amenities, prices, and addresses:', updatedList);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchProperties();
//   }, []);

//   const handleFilterChange = (newFilters) => {
//     setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
//   };

//   const handleAmenityChange = (amenities) => {
//     setSelectedAmenities(amenities);
//   };

//   return (
//     <Container maxWidth="lg">
//       <BannerOffers />
//       <SortMenu />
//       <div className="content-layout">
//         <SideBar onAmenityChange={handleAmenityChange} onFilterChange={handleFilterChange} filters={filters} />
//         <MainContent selectedAmenities={selectedAmenities} accommodations={accommodationlist} filters={filters} pricinglist={pricinglist} searchData={searchData} setSearchData={setSearchData} />
//       </div>
//     </Container>
//   );
// };

// export default PropertyListUI;

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
      <BannerOffers />
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

