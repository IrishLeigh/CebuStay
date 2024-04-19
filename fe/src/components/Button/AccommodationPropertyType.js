import React, { useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

const buttonsData = [
  { label: "Beachfront", image: "beachfront.png" },
  { label: "Campers", image: "Campers.png" },
  { label: "Boat", image: "boat.png" },
  { label: "Islands", image: "islands.png" },
  { label: "Waterfalls", image: "waterfalls.png" },
  { label: "Pools", image: "pools.png" },
  { label: "Golfing", image: "Golf.png" },
  { label: "Camping", image: "camping.png" },
  { label: "Beach", image: "beach.png" },
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
      style={{
        maxWidth: "100vh",
        textAlign: "initial",
      }}
    >
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
                  backgroundColor: selectedButtons.includes(button.label)
                    ? "#16B4DD"
                    : "white",
                  color: selectedButtons.includes(button.label)
                    ? "white"
                    : "black",
                  fontFamily: "Poppins, sans-serif",
                  width: 200,
                  height: 80,
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
