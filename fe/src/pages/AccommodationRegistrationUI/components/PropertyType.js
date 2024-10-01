import React, { useState, useEffect } from "react";
import { Button, Container, Box, Typography, Grid } from "@mui/material";
import AnimatePage from "./AnimatedPage";
import AccommodationOtherButton from "../../../components/Button/AccommodationOtherButton"; // Ensure correct import
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Ensure the import for back icon

const propertyTypes = [
  {
    name: "Apartment",
    description: "Self-contained unit within a building, typically offering one or more bedrooms, a bathroom, a kitchen, and a living area.",
  },
  {
    name: "Home",
    description: "Private residential property offering multiple rooms, including bedrooms, bathrooms, a kitchen, and living spaces.",
  },
  {
    name: "Condominium",
    description: "A residential property with private units and shared amenities like pools and fitness centers.",
  },
  {
    name: "Others", // This will act as a flag only
    description: "Diverse accommodations beyond traditional options, such as vacation rentals, cottages, or other unique properties.",
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
  { label: "Luxury Home", icon: "/luxuryhome.png" },
  { label: "Bungalow", icon: "/homestay.png" },
  { label: "Studio", icon: "/motel.png" },
];

export default function PropertyType({ onSelectedTypeChange, parentSelectedData, handleNext }) {
  const initialType = parentSelectedData || propertyTypes[0].name;
  const [selectedType, setSelectedType] = useState(initialType);
  const [showOthers, setShowOthers] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null); // Store a single button

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
    <Container>
      <AnimatePage>
        {!showOthers ? (
          <>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "left" }}>
              Unlock the door to hosting with CebuStay! List your property and open your doors to guests effortlessly!
            </Typography>

            <Typography sx={{ fontSize: "1.1rem", textAlign: "left", marginBottom: 4 }}>
              Ready to dive in? Kickstart your hosting journey by selecting the perfect property type to list on CebuStay.
            </Typography>

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
                          src={`/${type.name.toLowerCase()}.png`}
                          alt={type.name}
                          style={{ width: "60px", height: "60px" }}
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
                        }}
                      >
                        {type.name}
                      </Typography>
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
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Box mt={2} display="flex" alignItems="center">
              <Button onClick={handleBack} style={{ textTransform: 'none', padding: 0 }}>
                <ArrowBackIcon style={{ marginRight: 8 }} />
                Back
              </Button>
            </Box>

            <Box mt={3}>
              <Typography variant="h5" fontWeight="bold">
                Property Type
              </Typography>
              <Typography fontSize={18} mb={2}>
                Please click on the button you want to choose
              </Typography>
              <Grid container spacing={2}>
                {buttonsData.map((button, index) => (
                  <Grid item xs={4} key={index} style={{ margin: "0 auto" }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor:
                          selectedButton === button.label ? "#16B4DD" : "white",
                        color: selectedButton === button.label ? "white" : "black",
                        fontFamily: "Poppins, sans-serif",
                        width: 200,
                        height: 80,
                      }}
                      startIcon={
                        <img
                          src={button.icon}
                          alt={button.label}
                          style={{ width: 40, height: 40, marginRight: 10 }}
                        />
                      }
                      onClick={() => handleButtonClickInsideOthers(button.label)} // Only buttons inside "Others" will be saved
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
