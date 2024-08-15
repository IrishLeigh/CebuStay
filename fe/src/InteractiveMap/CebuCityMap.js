// import React from 'react';
// import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const CebuCityMap = () => {
//   const bounds = [
//     [10.015, 123.700], 
//     [10.515, 124.200]  
//   ];

//   const imageUrl = '/map.svg';

//   return (
//     <MapContainer
//       center={[10.3157, 123.8854]}
//       zoom={11}
//       style={{ height: "100vh", width: "100%" }}
//       maxBounds={bounds}
//       minZoom={11}
//       maxZoom={14}
//     >
//       <ImageOverlay
//         url={imageUrl}
//         bounds={bounds}
//       />

//     </MapContainer>
//   );
// };

// export default CebuCityMap;


import React from 'react';
import './CebuCityMap.css'; // Import the CSS file

const CebuCityMap = () => {
  return (
    <div className="map-container">
      <img
        src={`${process.env.PUBLIC_URL}/map.svg`}
        alt="Cebu City Map"
        className="map-image"
      />
      
      {/* Interactive Elements (Example: Cebu City) */}
      <div className="map-marker cebu-city" onClick={() => alert('Cebu City clicked!')}>
        Cebu City
      </div>
      
      {/* Add more markers here */}
    </div>
  );
};

export default CebuCityMap;
