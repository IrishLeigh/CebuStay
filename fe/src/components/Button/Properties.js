import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import "../../components/Button/NextButton.css";

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

export default function Properties({ onSelectedTypeChange, parentSelectedData  }) {
  const [selectedType, setSelectedType] = useState(parentSelectedData);

  // useEffect(() => {
  //   const storedSelectedType = localStorage.getItem("selectedType");
  //   if (storedSelectedType) {
  //     setSelectedType(storedSelectedType);
  //   }
  // }, []);

  // const handleClick = (button) => {
  //   const newSelectedType = selectedType === button ? null : button;
  //   setSelectedType(newSelectedType);
  //   localStorage.setItem("selectedType", newSelectedType);
  //   onSelectedTypeChange(selectedType === button ? null : button);
  //   console.log("Property:", newSelectedType);
  // };


// Inside the handleClick function
const handleClick = (button) => {
  setSelectedType(selectedType === button ? null : button);
  console.log("Selected Type after click:", selectedType); // Log the selected type after click
  onSelectedTypeChange(selectedType === button ? null : button); // Propagate selectedType to parent
  console.log("Property:", selectedType === button ? null : button); // Log selected property
};

  console.log("selected type sulod: ", selectedType);
  return (
    <Box>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          mb:"4rem",
          mt:"4rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            textAlign: "left",
          }}
        >
          Unlock the door to hosting with CebuStay! List your property and open
          your doors to guests effortlessly!
        </Typography>

        <Typography
          sx={{
            fontSize: "1.1rem",
            textAlign: "left",
            marginBottom: 4,
          }}
        >
          Ready to dive in? Kickstart your hosting journey by selecting the
          perfect property type to list on CebuStay?
        </Typography>

        <Grid container spacing={2} justifyContent="center" mb={5}>
          {propertyTypes.map((type, index) => (
            <Grid item xs={12} key={index}>
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      selectedType === type.name ? "#1780CB" : "white",
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
                      style={{
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
      </Container>
    </Box>
  );
}
