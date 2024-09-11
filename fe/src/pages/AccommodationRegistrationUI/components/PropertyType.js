import React, { useState, useEffect } from "react";
import { Button, Container, Box, Typography, Grid, ToggleButton } from "@mui/material";
import AnimatePage from "./AnimatedPage";

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
    name: "Hotel",
    description: "Commercial establishment offering various types of accommodations and amenities such as room service and housekeeping.",
  },
  {
    name: "Others",
    description: "Diverse accommodations beyond traditional options, such as vacation rentals, cottages, or other unique properties.",
  },
];

export default function PropertyType({ onSelectedTypeChange, parentSelectedData, handleNext }) {
  const initialType = parentSelectedData || propertyTypes[0].name;
  const [selectedType, setSelectedType] = useState(initialType);

  useEffect(() => {
    window.scrollTo(0, 0); 
    onSelectedTypeChange(selectedType);
  }, [selectedType, onSelectedTypeChange]);

  const handleClick = (button) => {
    setSelectedType(button);
  };

  const validateAndProceed = () => {
    if (selectedType === "") {
      alert("Please select a property type.");
    } else {
      handleNext();
    }
  };

  return (
    <Container  >
      <AnimatePage>
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
                      src={`${type.name.toLowerCase()}.png`}
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
      </AnimatePage>
      <div className="stepperFooter">
        <Button disabled  className="stepperPrevious">
          Back
        </Button>

        <Button  onClick={validateAndProceed} className="stepperNext">
          Next
        </Button>
      </div>

      {/* <Box mt={4} display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" onClick={validateAndProceed}>
            Next
          </Button>
        </Box> */}
    </Container>
  );
}
