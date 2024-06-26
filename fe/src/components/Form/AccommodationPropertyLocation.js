import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import AccommodationPropertyMap from "./AccommodationPropertyMap";
import { useData } from "../registration_unit/registration_location/contextAddressData";
import '../../components/Button/NextButton.css';

const AddressForm = () => {
  const { location } = useData();
  const [addressData, setAddressData] = useState({});
  const [street, setStreet] = useState(localStorage.getItem('street') || "");
  const [postalCode, setPostalCode] = useState(localStorage.getItem('postalCode') || "");
  const [addPin, setAddPin] = useState(null);

  useEffect(() => {
    // Save input data to localStorage whenever it changes
    localStorage.setItem('street', street);
    localStorage.setItem('postalCode', postalCode);
  }, [street, postalCode]);

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

        // Scroll to the map section
        document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
      } else {
        console.error("No results found in the geocoding response.");
      }
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
        <Box
            sx={{
              display: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              padding: "1rem",
              mt: "4rem",
              mb: "8rem"
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">
                  Property Location
                </Typography>

                <Typography sx={{ fontSize: "1.5rem", width: "100%" }} mb={2} >
                  Idk Here yet.
                </Typography>
              </div>
            </Box>
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
              <div className='nextButton-container'>
                <button className="nextButton" onClick={handleSubmit} sx={{ color: '#007BFF' }}>Pin Your Location</button>
              </div>
            </Paper>
          </Box>


          <div id="map-section">
            {addPin && (
              <AccommodationPropertyMap
                location={addPin}
                onMapValChange={(mapVal) =>
                  setAddressData({ ...addressData, mapVal })
                }
              />
            )}
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddressForm;
