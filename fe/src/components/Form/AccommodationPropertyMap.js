import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { Container, Button, Typography, Paper } from "@mui/material";
import { useData } from "../registration_unit/registration_location/contextAddressData";

const MapForm = ({ google, location}) => {

  const {location2} = useData();
  const [position, setPosition] = useState(location);
  const [ mapVal, setMapVal ] = useState(); // Use the useData hook to access mapVal

  useEffect(() => {
    // When location prop changes, update the position
    setPosition(location);
  }, [location]);

  const onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    setPosition(latLng);
  
    // Extract latitude and longitude from latLng object
    const latitude = latLng.lat();
    const longitude = latLng.lng();
  
    const newMapVal = `${latitude}, ${longitude}`;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
  
    // Update mapVal in the context
    setMapVal(newMapVal);
    
    
  };

  const resetPosition = () => {
    setPosition(null);
  };

  const saveLocation = () => {
    if (position) {
      setMapVal(position.lat + ", " + position.lng);
      location2(position);

      console.log("Location saved:", position.lat, position.lng);
    } else {
      console.log("No location to save");
    }
  };

  // console.log("Map", maploVal);

  return (
    <Container
      maxWidth="sm"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem", // Adjusted padding
      }}
    >
      <div
        style={{ width: "100%", maxWidth: "50rem", marginBottom: "1.25rem" }}
      >
        {" "}
        {/* Adjusted maxWidth */}
        <Typography sx={{ fontSize: "2rem", mb: 2, textAlign: "left" }}>
          Pin your exact location
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: "1rem",
            borderRadius: ".5rem",
            padding: "2rem",
          }}
        >
          {" "}
          {/* Adjusted padding */}
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
              lat: position.lat,
              lng: position.lng,
            }}
            onClick={onMapClick}
            mapTypeId={"terrain"}
          >
            {position && <Marker position={position} draggable={true} onDragend={(t, map, coords) => setPosition(coords.latLng)} />}
          </Map>
          <Button
            variant="contained"
            onClick={resetPosition}
            style={{ fontSize: "1rem", marginTop: "1rem" }}
          >
            {" "}
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
