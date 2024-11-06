import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import AccommodationPropertyMap from "./AccommodationPropertyMap";
import { useData } from "../registration_unit/registration_location/contextAddressData";
import '../../components/Button/NextButton.css';
import { Button } from '@mui/material';
import AnimatePage from "../../pages/AccommodationRegistrationUI/components/AnimatedPage";

const AddressForm = ({ handleNext, handleBack }) => {
  const { location } = useData();
  const [addressData, setAddressData] = useState({});
  const [street, setStreet] = useState(localStorage.getItem('street') || "");
  const [postalCode, setPostalCode] = useState(localStorage.getItem('postalCode') || "");
  const [addPin, setAddPin] = useState(null);
  const [mapVal, setMapVal] = useState(null); // Track map value state
  const [showAnotherComponent, setShowAnotherComponent] = useState(false); // State to control rendering of another component
  const [address, setAddress] = useState("");

  // const handleAddressChange = (newAddress) => {
  //   setAddress(newAddress);
  // };

  const handleAddressChange = (newAddress) => {
    // Split newAddress to extract street and postalCode if needed
    const [streetPart, postalCodePart] = newAddress.split(", ");
    setStreet(streetPart || newAddress);
    setAddress(newAddress);
  };


  useEffect(() => {
    // Save input data to localStorage whenever it changes
    localStorage.setItem('street', street);
    localStorage.setItem('postalCode', postalCode);
  }, [street, postalCode]);

  const validateAndProceed = () => {
    if (street && postalCode && addPin ) {
      handleNext();
    } else if (mapVal === null) {
      alert("Please pin your exact location on the map.");

    }else {
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

        // Show the other component
        setShowAnotherComponent(true);
      } else {
        console.error("No results found in the geocoding response.");
      }
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
    }
  };

  return (
    <Container maxWidth="lg" className="centered-container">
      <AnimatePage>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>
                Property Location
              </Typography>
              <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
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
                <TextField
                  label="Full Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  helperText="Address from the map"
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled
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
              </Paper>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box className={addPin ? 'active' : 'greyed-out'}>
              {showAnotherComponent && (
                <AccommodationPropertyMap
                  location={addPin}
                  onMapValChange={(mapVal) => {
                    setAddressData({ ...addressData, mapVal });
                    setMapVal(mapVal); // Update mapVal state
                  }}
                  onAddressChange={handleAddressChange}
                />
              )}
            </Box>
          </Grid>
        </Grid>
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

export default AddressForm;
