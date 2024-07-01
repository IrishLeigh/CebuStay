import React, { useRef } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Link } from '@mui/material';

const MapComponent = ({ google, position, onMapClick }) => {
  const mapRef = useRef(null);

  const openInGoogleMaps = () => {
    const { lat, lng } = position || { lat: 0, lng: 0 };
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };


  return (
    <div>

      <Map
        google={google}
        zoom={14}
        containerStyle={{
          width: "100%",
          height: "10rem",
          position: "relative",
          borderRadius: "1rem",
        }}
        initialCenter={{
          lat: position ? position.lat : 0,
          lng: position ? position.lng : 0,
        }}
        onClick={onMapClick}
        mapTypeId={"terrain"}
        ref={mapRef}
      >
        {position && <Marker position={position} />}


      </Map>
      <div style={{}}>
        {/* <button onClick={openInGoogleMaps}>View in Google Maps</button> */}
        <Link onClick={openInGoogleMaps} style={{ cursor: 'pointer' }}>View in Google Maps</Link>
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM",
})(MapComponent);
