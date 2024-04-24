import React, { useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { Container, Button, Typography, Paper } from "@mui/material";

const MapForm = ({ google }) => {
  const [position, setPosition] = useState(null);
  const [mapVal, setMapVal] = useState("");

  const onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    setPosition(latLng);

    // Extract latitude and longitude from latLng object
    const latitude = latLng.lat();
    const longitude = latLng.lng();

    setMapVal(latitude + ", " + longitude);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
  };

  const resetPosition = () => {
    setPosition(null);
  };

  console.log("Map", mapVal);

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
              lat: 10.3157,
              lng: 123.8854,
            }}
            onClick={onMapClick}
            mapTypeId={"terrain"}
          >
            {position && (
              <Marker
                position={position}
                draggable={true}
                onDragend={(t, map, coords) => setPosition(coords.latLng)}
              />
            )}
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
        </Paper>
      </div>
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM",
})(MapForm);
