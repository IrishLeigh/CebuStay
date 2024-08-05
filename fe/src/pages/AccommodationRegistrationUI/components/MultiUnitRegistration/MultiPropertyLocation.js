import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { useData } from "../../../../components/registration_unit/registration_location/contextAddressData";
import { Button } from '@mui/material';
import AnimatePage from "../AnimatedPage";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const MultiPropertyLocation = ({ handleNext, handleBack, google }) => {
  const { location } = useData();
  const [addressData, setAddressData] = useState({});
  const [street, setStreet] = useState(localStorage.getItem('street') || "");
  const [postalCode, setPostalCode] = useState(localStorage.getItem('postalCode') || "");
  const [addPin, setAddPin] = useState(null);
  const [mapVal, setMapVal] = useState(null); // Track map value state
  const mapRef = useRef(null);
  
  const {location2} = useData();
  const [position, setPosition] = useState(addPin);
  const [mapPos, setMapPos] = useState(addPin);

  useEffect(() => {
    // When location prop changes, update the position
    setPosition(addPin);
  }, [addPin]);

  useEffect(() => {
    // Save input data to localStorage whenever it changes
    localStorage.setItem('street', street);
    localStorage.setItem('postalCode', postalCode);
  }, [street, postalCode]);

  const validateAndProceed = () => {
    if (street && postalCode && addPin) {
      saveLocation();
      handleNext();
    } else if (mapVal === null) {
      alert("Please pin your exact location on the map.");
    } else {
      alert("Please fill in all the required fields and pin your location on the map.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "street":
        setStreet(value);
        break;
      case "postalCode":
        setPostalCode(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const address = `${street}, Cebu, Philippines, ${postalCode}`;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch geolocation data");
      }

      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;

        setAddPin({ lat, lng });
        location({ street, postalCode });
      } else {
        console.error("No results found in the geocoding response.");
      }
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
    }
  };

  const onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    setPosition({ lat: latitude, lng: longitude });
    setMapPos({ lat: latitude, lng: longitude });
    setMapVal(`${latitude}, ${longitude}`);
  };

  const resetPosition = () => {
    setPosition(null);
  };

  const saveLocation = () => {
    if (position) {
      setMapVal(`${position.lat}, ${position.lng}`);
      location2(mapPos);
      console.log("Location saved:", position.lat, position.lng);
    } else {
      console.log("No location to save");
    }
  };

  useEffect(() => {
    if (mapRef.current && position) {
      // Update the center of the map when position changes
      mapRef.current.map.setCenter(position);
    }
  }, [position]);

  return (
    <Container maxWidth="lg" className="centered-container">
      <AnimatePage>
        <Box 
           display="flex"
           justifyContent="center"
           alignItems="center"  
        >
          <Paper
            sx={{
              width: '80vw',
              padding: '2rem',
              borderRadius: '0.8rem',
              boxShadow: 3,
            }}
          >
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold" , mb: 2, fontFamily: "Poppins"}}>
              Property Location
            </Typography>
            
            <Typography sx={{ fontSize: "1rem" }} mb={2}>
              Describe your property in detail. Highlight its unique features,
              amenities, and any additional information potential tenants or
              buyers should know.
            </Typography>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box >
                  
                
                    <TextField
                      label="Street Address"
                      value={street}
                      name="street"
                      onChange={handleChange}
                      helperText="Enter your street address"
                      fullWidth
                    />
                    <TextField
                      label="Postal/ZIP Code"
                      value={postalCode}
                      name="postalCode"
                      onChange={handleChange}
                      helperText="Enter your postal or ZIP code"
                      fullWidth
                    />
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                      >
                        Pin Your Location
                      </Button>
                    </Box>
                  
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box className={addPin ? 'active' : 'greyed-out'}>
                  {/* <Typography sx={{ fontSize: "1rem", textAlign: "left", fontFamily: "Poppins" }} fontWeight="bold">
                    Pin your exact location here:
                  </Typography> */}
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
                        borderRadius: "0.8rem",
                      }}
                      initialCenter={{
                        lat: addPin ? addPin.lat : 0,
                        lng: addPin ? addPin.lng : 0,
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
                      Reset
                    </Button>
                    {/* <Button
                      variant="contained"
                      onClick={saveLocation}
                      style={{ fontSize: "1rem", marginTop: "1rem" }}
                    >
                      Save Location
                    </Button> */}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </AnimatePage>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button onClick={validateAndProceed} className="stepperNext">
          Next
        </Button>
      </div>
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM",
})(MultiPropertyLocation);
