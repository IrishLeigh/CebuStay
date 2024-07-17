import React, { useState, useEffect, useRef } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { Container, Button, Typography, Paper } from "@mui/material";
import { useData } from "../registration_unit/registration_location/contextAddressData";

const MapForm = ({ google, location}) => {

  const {location2} = useData();
  const [position, setPosition] = useState(location);
  const [mapPos, setMapPos] = useState(location);
  const [ mapVal, setMapVal ] = useState(); // Use the useData hook to access mapVal
  const mapRef = useRef(null);

  useEffect(() => {
    // When location prop changes, update the position
    setPosition(location);
    setMapPos(location);
  }, [location]);

  const onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    setPosition(latLng);
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    setMapPos({ lat: latitude, lng: longitude });
  
    const newMapVal = `${latitude}, ${longitude}`;
    setMapVal(newMapVal);
  };

  const resetPosition = () => {
    setPosition(null);
  };

  const saveLocation = () => {
    if (position) {
      setMapVal(position.lat + ", " + position.lng);
      location2(mapPos);

      console.log("Location saved:", position.lat, position.lng);
    } else {
      console.log("No location to save");
    }
  };

  useEffect(() => {
    if (mapRef.current && position) {
      // Update the center of the map when position changes
      mapRef.current.map.setCenter(location);
    }
  }, [location]);

  return (
    <Container >
      <div
        style={{ width: "100%"}}
      >
        <Typography sx={{ fontSize: "2rem", textAlign: "left" , }} fontWeight="bold">
          Pin your exact location
        </Typography>
        <Paper
          elevation={3}
          sx={{
            borderRadius: ".5rem",
            padding: "1rem",
            width: "100%",
          }}
        >
          <Map
            google={google}
            zoom={14}
            containerStyle={{
              width: "100%",
              height: "25rem",
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
            {position && <Marker position={position} draggable={true} onDragend={(t, map, coords) => setPosition(coords.latLng)} />}
          </Map>
          <Button
            variant="contained"
            onClick={resetPosition}
            style={{ fontSize: "1rem", marginTop: "1rem" }}
          >

            {/* Adjusted fontSize */}
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={saveLocation}
            style={{ fontSize: "1rem", marginTop: "1rem" }}
          >
            {" "}
            {/* Adjusted fontSize */}
            Save Location
          </Button>
        </Paper>
      </div>
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM",
})(MapForm);
