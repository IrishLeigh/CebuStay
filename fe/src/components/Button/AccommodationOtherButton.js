import React, { useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

// Replace these image paths with your own image URLs or imports
const buttonsData = [
  { label: "Hostel", icon: "/hostel.png" },
  { label: "Villa", icon: "/villa.png" },
  { label: "Cabin", icon: "/cabin.png" },
  { label: "Bed & Breakfast", icon: "/bnb.png" },
  { label: "Resort", icon: "/resorts.png" },
  { label: "Condominium", icon: "/condominium.png" },
  { label: "Luxury Home", icon: "/luxuryhome.png" },
  { label: "Homestay", icon: "/homestay.png" },
  { label: "Motel", icon: "/motel.png" },
];

const AccommodationOtherButton = () => {
  const [selectedButton, setSelectedButton] = useState(null); // Changed to store a single button

  const handleButtonClick = (button) => {
    // Toggle the selected button
    setSelectedButton(selectedButton === button ? null : button);
  };

  return (
    <Container style={{ maxWidth: "100vh" }}>
      <Box mt={25}>
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
                onClick={() => handleButtonClick(button.label)}
              >
                {button.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AccommodationOtherButton;
