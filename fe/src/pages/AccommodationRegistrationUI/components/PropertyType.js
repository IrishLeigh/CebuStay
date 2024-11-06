import React, { useState, useEffect } from "react";
import { Button, Container, Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import AnimatePage from "./AnimatedPage";
import AccommodationOtherButton from "../../../components/Button/AccommodationOtherButton"; // Ensure correct import
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Ensure the import for back icon

const propertyTypes = [
  {
    name: "Private Residential",
    description: "A standalone home ideal for families or groups seeking privacy.",
    icon: "/apartment.png",
  },
  {
    name: "Townhouse",
    description: "A multi-story home sharing walls with neighbors, often with a small yard.",
    icon: "/home.png",
  },
  {
    name: "Subdivision House",
    description: "A house in a community with shared amenities like parks or security.",
    icon: "/home.png",
  },
  {
    name: "Condominium",
    description: "A private unit with shared amenities like pools and gyms.",
    icon: "/condominium.png",
  },
  {
    name: "Others",
    description: "Unique accommodations, including vacation rentals and cottages.",
    icon: "/Others.png",
  },
];

// Replace these image paths with your own image URLs or imports
const buttonsData = [
  // { label: "Hostel", icon: "/hostel.png" },
  { label: "Villa", icon: "/villa.png" },
  { label: "Cabin", icon: "/cabin.png" },
  // { label: "Bed & Breakfast", icon: "/bnb.png" },
  // { label: "Resort", icon: "/resorts.png" },
  { label: "Cottage", icon: "/resorts.png" },
  { label: "Loft", icon: "/luxuryhome.png" },
  { label: "Bungalow", icon: "/homestay.png" },
  { label: "Studio", icon: "/motel.png" },
];

export default function PropertyType({ onSelectedTypeChange, parentSelectedData, handleNext }) {
  const initialType = parentSelectedData || propertyTypes[0].name;
  const [selectedType, setSelectedType] = useState(initialType);
  const [showOthers, setShowOthers] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null); // Store a single button
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Track screen width
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth); // Update screen width
    };

    window.addEventListener('resize', handleResize); // Add event listener
    return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (selectedType !== "Others") {
      onSelectedTypeChange(selectedType);
    }
  }, [selectedType, onSelectedTypeChange]);

  const handleClick = (button) => {
    if (button === "Others") {
      setShowOthers(true);
    } else {
      setSelectedType(button); // Update the selected type if it's not "Others"
      setShowOthers(false); // Close the others section if another type is selected
    }
  };

  const validateAndProceed = () => {
    if (selectedType === "") {
      alert("Please select a property type.");
    } else {
      handleNext();
    }
  };

  const handleBack = () => {
    setShowOthers(false);
    setSelectedType(initialType);
  };

  const handleButtonClickInsideOthers = (button) => {
    setSelectedButton(button);
    setSelectedType(button); // Update selectedType when clicking an "Others" option
  };

  return (
    <Container maxWidth="md">
      <AnimatePage>
        {!showOthers ? (
          <>
            {/* Conditionally render description based on screen width */}
           
              <>
                <Typography sx={{ fontWeight: "bold", fontSize: "2rem", textAlign: "left" }}>
                  Property Type
                </Typography>

                <Typography sx={{ fontSize: "1rem", textAlign: "left", marginBottom: 4 }}>
                   Kickstart your hosting journey by selecting the perfect property type to list on CebuStay.
                </Typography>
              </>


            <Grid container spacing={2} justifyContent="center" mb={5}>
              {propertyTypes.map((type, index) => (
                <Grid item xs={12} key={index}>
                  <Box>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: selectedType === type.name ? "#1780CB" : "white",
                        color: selectedType === type.name ? "white" : "black",
                        fontFamily: "Poppins, sans-serif",
                        width: "100%",
                        height: 80,
                        "&:hover": { backgroundColor: "#16B4DD", color: "white" },
                      }}
                      startIcon={
                        <img
                          src={type.icon}
                          alt={type.icon}
                          style={{ width: "50px", height: "50px" }}
                        />
                      }
                      onClick={() => handleClick(type.name)}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1.125rem",
                          textTransform: "initial",
                          width: "250px",
                          textAlign: "left",
                        }}
                      >
                        {type.name}
                      </Typography>
                      {screenWidth >= 768 && (
                      <Typography
                        sx={{
                          width: "100%",
                          fontSize: { xs: "0.65rem", sm: "1rem" },
                          textTransform: "initial",
                          textAlign: "left",
                        }}
                      >
                        {type.description}
                      </Typography>
                    )}
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          // Others Button
          <>
            <Box mt={2} display="flex" alignItems="center">
              <Button 
                onClick={handleBack}  
                variant="text" 
                style={{ 
                  textTransform: 'none', 
                  padding: 0 ,
                  color: '#6A6A6A',
                  backgroundColor: 'transparent',
                }}>
                <ArrowBackIcon style={{ marginRight: 8 }} />
                Back to Property Type
              </Button>
            </Box>

            <Box mt={3}>
    <Typography fontSize={16} mb={2}>
      This section features a variety of unique and non-traditional homes, ideal for those seeking something different.
    </Typography>

    <Grid container spacing={2}>
      {buttonsData.map((button, index) => (
        <Grid
          item
          xs={12} sm={6} md={4} // Adjust column layout for different screen sizes
          key={index}
          display="flex"
          justifyContent="center"
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: selectedButton === button.label ? "#16B4DD" : "white",
              color: selectedButton === button.label ? "white" : "black",
              fontFamily: "Poppins, sans-serif",
              height: 80,
              fontWeight: "bold",
              fontSize: "1.125rem",
              textTransform: "initial",
              width: { xs: '100%', sm: '75%', md: '250px' }, // Responsive width
              maxWidth: '250px',
            }}
            startIcon={
              <img
                src={button.icon}
                alt={button.label}
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
            }
            onClick={() => handleButtonClickInsideOthers(button.label)}
          >
            {button.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  </Box>
          </>
        )}
      </AnimatePage>
      <div className="stepperFooter">
        <Button disabled className="stepperPrevious" onClick={handleBack}>
          Back
        </Button>

        <Button onClick={validateAndProceed} className="stepperNext">
          Next
        </Button>
      </div>
    </Container>
  );
}
