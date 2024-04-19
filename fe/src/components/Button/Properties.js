import React, { useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const propertyTypes = [
  {
    name: "Apartment",
    description:
      "Self-contained unit within a building, typically offering one or more bedrooms, a bathroom, a kitchen, and a living area.",
  },
  {
    name: "Home",
    description:
      "Private residential property offering multiple rooms, including bedrooms, bathrooms, a kitchen, and living spaces.",
  },
  {
    name: "Hotel",
    description:
      "Commercial establishment offering various types of accommodations and amenities such as room service and housekeeping.",
  },
  {
    name: "Others",
    description:
      "Diverse accommodations beyond traditional options, such as vacation rentals, cottages, or other unique properties.",
  },
];

export default function Properties() {
  const [selectedType, setSelectedType] = useState(null);

  const handleClick = (button) => {
    setSelectedType(selectedType === button ? null : button);
  };

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "left" }}>
          <div>
            Unlock the door to hosting with CebuStay! List your property and
            open your
          </div>
          <div> doors to guests effortlessly!</div>
        </Typography>
        <Typography sx={{ fontSize: 18, textAlign: "left", mb: 2 }}>
          <div>
            Ready to dive in? Kickstart your hosting journey by selecting the
            perfect property type to list on CebuStay?
          </div>
        </Typography>

        <Paper
          elevation={3}
          sx={{
            boxShadow: "none",
          }}
        >
          {propertyTypes.map((type, index) => (
            <Box key={index} width={800} mb={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor:
                    selectedType === type.name ? "#1780CB" : "white",
                  color: selectedType === type.name ? "white" : "black",
                  fontFamily: "Poppins, sans-serif",
                  width: "100%",
                  height: 80,
                  pt: 5,
                  pb: 5,
                  "&:hover": { backgroundColor: "#16B4DD", color: "white" },
                }}
                startIcon={
                  <img
                    src={`${type.name.toLowerCase()}.png`}
                    alt={type.name}
                    style={{
                      marginRight: "10px",
                      width: "60px",
                      height: "60px",
                    }}
                  />
                }
                onClick={() => handleClick(type.name)}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: 18,
                    textTransform: "initial",
                    width: "250px",
                  }}
                >
                  {type.name}
                </Typography>
                <Typography
                  sx={{
                    textAlign: "left",
                    fontSize: "16px",
                    textTransform: "initial",
                    width: "100%",
                  }}
                >
                  {type.description}
                </Typography>
              </Button>
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}
