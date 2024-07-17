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

  const AddressForm = ( {handleNext, handleBack}) => {
    const { location } = useData();
    const [addressData, setAddressData] = useState({});
    const [street, setStreet] = useState(localStorage.getItem('street') || "");
    const [postalCode, setPostalCode] = useState(localStorage.getItem('postalCode') || "");
    const [addPin, setAddPin] = useState(null);
    const [showAnotherComponent, setShowAnotherComponent] = useState(false); // State to control rendering of another component

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
          <Grid container >
            <Grid item xs={12} md={6}>
              <Box
              >
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
                <Box
                
                > 
                  {/* Render the another component here */}
                  <AccommodationPropertyMap
                  
                  location={addPin}
                  onMapValChange={(mapVal) =>
                    setAddressData({ ...addressData, mapVal })
                  }
              />
                </Box>
              </Grid>
          </Grid>
        </AnimatePage> 
        <div className="stepperFooter">
          <Button onClick={handleBack} className="stepperPrevious">
            Back
          </Button>
          <Button onClick={handleNext} className="stepperNext">
            Next
          </Button>
        </div>

        {/* <Box id="map-section" mt={4}>
          {addPin && (
            
          )}
        </Box> */}
      </Container>
    );
  };

  export default AddressForm;
