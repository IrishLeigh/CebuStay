import React, { useState, useEffect, useRef } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { Container, Typography, Paper, Button } from "@mui/material";
import * as turf from "@turf/turf";
import CebuGeoJson from "../../InteractiveMap/data/Cebu.MuniCities.json";
import { useData } from "../registration_unit/registration_location/contextAddressData";

const MapForm = ({ google, location, onAddressChange }) => {
  const {location2} = useData();
  const [position, setPosition] = useState(location);
  const [address, setAddress] = useState("");
  const [isInCebu, setIsInCebu] = useState(false);
  const mapRef = useRef(null);
  const [mapPos, setMapPos] = useState(location);
  const [mapVal, setMapVal] = useState();

  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.map.setCenter(position);
    }
  }, [position]);

  useEffect(() => {
    setPosition(location);
    fetchAddress(location); // Fetch address when location changes
    setMapPos(location);
  }, [location]);

  const fetchAddress = async (latLng) => {
    const { lat, lng } = latLng;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        onAddressChange(formattedAddress); // Notify the parent of the address change

        // Check if the address is within Cebu
        const point = turf.point([lng, lat]);
        const isInCebuArea = CebuGeoJson.features.some((feature) =>
          turf.booleanPointInPolygon(point, feature)
        );
        setIsInCebu(isInCebuArea); // Update whether the point is within Cebu
      }
    } catch (error) {
      console.error("Error fetching address data:", error);
    }
  };

  const onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    const newPos = { lat: latitude, lng: longitude };

    setPosition(newPos);
    fetchAddress(newPos);
    setMapVal(`${latitude}, ${longitude}`);
  };

  const resetPosition = () => {
    setPosition(null);
    setAddress("");
    setIsInCebu(false);
  };

  const saveLocation = () => {
    if (position) {
      if (isInCebu) {
        setMapVal(position.lat + ", " + position.lng);
        location2(mapPos);
        console.log("Location saved:", position.lat, position.lng);
      } else {
        console.log("The location is outside Cebu.");
      }
    } else {
      console.log("No location to save");
    }
  };

  return (
    <Container>
      <div style={{ width: "100%" }}>
        <Typography sx={{ fontSize: "2rem", textAlign: "left" }} fontWeight="bold">
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
            initialCenter={position}
            onClick={onMapClick}
            mapTypeId={"terrain"}
            ref={mapRef}
          >
            {position && (
              <Marker
                position={position}
                draggable={true}
                onDragend={(t, map, coords) => {
                  const newPosition = { lat: coords.latLng.lat(), lng: coords.latLng.lng() };
                  setPosition(newPosition);
                  fetchAddress(newPosition); // Fetch address when pin is dragged
                }}
              />
            )}
          </Map>
          {!isInCebu && position && (
            <Typography color="error" sx={{ marginTop: "1rem" }}>
              The location you selected is outside Cebu.
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={resetPosition}
            style={{ fontSize: "1rem", marginTop: "1rem" }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={saveLocation}
            style={{ fontSize: "1rem", marginTop: "1rem" }}
            disabled={!isInCebu}
          >
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
