import React, { useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

const buttonsData = [
  { label: "Beachfront", image: "/beachfront.png" },
  { label: "Campers", image: "/Campers.png" },
  { label: "Boat", image: "/boat.png" },
  { label: "Islands", image: "/islands.png" },
  { label: "Waterfalls", image: "/waterfalls.png" },
  { label: "Pools", image: "/pools.png" },
  { label: "Golfing", image: "/Golf.png" },
  { label: "Camping", image: "/camping.png" },
  { label: "Beach", image: "/beach.png" },
];

const AccommodationPropertyType = () => {
  const [selectedButtons, setSelectedButtons] = useState([]);

  const handleButtonClick = (button) => {
    setSelectedButtons((prevButtons) =>
      prevButtons.includes(button)
        ? prevButtons.filter((btn) => btn !== button)
        : [...prevButtons, button]
    );
  };

  return (
    <Container
      maxWidth="md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">
          Property Type
        </Typography>
        <Typography sx={{ fontSize: "1.5rem" }} mb={2}>
          Please click on the button you want to choose
        </Typography>
        <Grid container spacing={2}>
          {buttonsData.map((button, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: selectedButtons.includes(button.label)
                    ? "#1780CB" // Color when clicked
                    : "white",
                  color: selectedButtons.includes(button.label)
                    ? "white"
                    : "black",
                  fontFamily: "Poppins, sans-serif",
                  width: "100%",
                  height: 80,
                  "&:hover": {
                    backgroundColor: "#16B4DD", // Color on hover
                    color: "white",
                  },
                }}
                startIcon={
                  <img
                    src={button.image}
                    alt={button.label}
                    style={{ marginRight: 10, width: 40, height: 40 }}
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

export default AccommodationPropertyType;
