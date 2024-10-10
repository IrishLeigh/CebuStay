import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Alert, Box, Snackbar } from "@mui/material";
import { useData } from "../../../../components/registration_unit/registration_location/contextAddressData";
import { Button } from "@mui/material";
import AnimatePage from "../AnimatedPage";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import CebuGeoJson from "../../../../InteractiveMap/data/Cebu.MuniCities.json";
import * as turf from "@turf/turf";

const MultiPropertyLocation = ({ handleNext, handleBack, google }) => {
  const { location, fullAddress } = useData();
  const [addressData, setAddressData] = useState({});
  const [street, setStreet] = useState(localStorage.getItem("street") || "");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState(
    localStorage.getItem("postalCode") || ""
  );
  const [addPin, setAddPin] = useState(null);
  const [mapVal, setMapVal] = useState(null); // Track map value state
  const mapRef = useRef(null);
  const [isInCebu, setIsInCebu] = useState(false);
  const { location2 } = useData();
  const [position, setPosition] = useState(addPin);
  const [mapPos, setMapPos] = useState(addPin);
  const topRef = useRef(null); // Create a ref for scrolling to the top
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Error states for form validation
  const [streetError, setStreetError] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState(false);



  useEffect(() => {
    window.scrollTo(0, 0);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the top of the component
    }
  }, []);

  useEffect(() => {
    // When location prop changes, update the position
    setPosition(addPin);
    fetchAddress(addPin);
    setMapPos(addPin);
  }, [addPin]);

  const handleAddressChange = (newAddress) => {
    // Split newAddress to extract street and postalCode if needed
    const [streetPart, postalCodePart] = newAddress.split(", ");
    setStreet(streetPart || newAddress);
    setAddress(newAddress);
  };

  const fetchAddress = async (latLng) => {
    if (!latLng) {
      console.warn("latLng is null or undefined. Exiting fetchAddress.");
      return; // Exit the function early if latLng is not provided
    }
    const { lat, lng } = latLng;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        handleAddressChange(formattedAddress);

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

  useEffect(() => {
    // Save input data to localStorage whenever it changes
    localStorage.setItem("street", street);
    localStorage.setItem("postalCode", postalCode);
  }, [street, postalCode]);

  const validateAndProceed = () => {
    let isValid = true;

    if (!street) {
      setStreetError(true);
      isValid = false;
      setSnackbarMessage("Street address is required.");
      setSnackbarOpen(true);
    } else {
      setStreetError(false);
    }

    if (!postalCode) {
      setPostalCodeError(true);
      isValid = false;
      setSnackbarMessage("Postal/ZIP code is required.");
      setSnackbarOpen(true);
    } else {
      setPostalCodeError(false);
    }

    if (isValid && addPin && address) {
      saveLocation();
      handleNext();
    } else if (mapVal === null) {
      setSnackbarMessage("Please pin your exact location on the map.");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please fill in all the required fields and pin your location on the map.");
      setSnackbarOpen(true);
    }
  };


  const handleChange = (event) => {
    setStreetError(false);
    setPostalCodeError(false);
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
        // setMapVal(`${lat}, ${lng}`);
        setMapPos({ lat, lng });
        location({ street, postalCode });
        fullAddress(address);
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
    const newPos = { lat: latitude, lng: longitude };

    fetchAddress(newPos);
    setPosition({ lat: latitude, lng: longitude });
    setMapPos({ lat: latitude, lng: longitude });
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
        setMapVal(`${position.lat}, ${position.lng}`);
        location2(mapPos);
        console.log("Location saved:", position.lat, position.lng);
      } else {
        console.log("The location is outside Cebu.");
      }
    } else {
      console.log("No location to save");
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  useEffect(() => {
    if (mapRef.current && position) {
      // Update the center of the map when position changes
      mapRef.current.map.setCenter(position);
    }
  }, [position]);

  return (
    <div ref={topRef} >
      <Container maxWidth="lg" className="centered-container">
        <AnimatePage>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Paper
              sx={{
                width: "80vw",
                padding: "2rem",
                borderRadius: "0.8rem",
                boxShadow: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  mb: 2,
                  fontFamily: "Poppins",
                }}
              >
                Property Location
              </Typography>

              <Typography sx={{ fontSize: "1rem" }} mb={2}>
                Describe your property in detail. Highlight its unique features,
                amenities, and any additional information potential tenants or
                buyers should know.
              </Typography>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box>
                  <TextField
                    label="Street Address"
                    value={street}
                    name="street"
                    onChange={handleChange}
                    helperText={streetError ? "Street address is required" : "Enter your street address"}
                    error={streetError}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Postal/ZIP Code"
                    value={postalCode}
                    name="postalCode"
                    onChange={handleChange}
                    helperText={postalCodeError ? "Postal/ZIP code is required" : "Enter your postal or ZIP code"}
                    error={postalCodeError}
                    fullWidth
                  />
                    {/* <TextField
                    label="Full Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    helperText="You cannot edit here. Pin your exact location on the map to view the full address"
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled
                    
                  /> */}
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
                  <Box className={addPin ? "active" : "greyed-out"}>
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
                        {position && (
                          <Marker
                            position={position}
                            draggable={true}
                            onDragend={(t, map, coords) =>{
                              const newPosition = { lat: coords.latLng.lat(), lng: coords.latLng.lng() };
                    setPosition(newPosition);
                    fetchAddress(newPosition); 
                          } }
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
            {/* <Button
              variant="contained"
              onClick={saveLocation}
              style={{ fontSize: "1rem", marginTop: "1rem" }}
              disabled={!isInCebu}
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
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM",
})(MultiPropertyLocation);
