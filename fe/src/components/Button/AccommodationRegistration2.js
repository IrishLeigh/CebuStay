import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const propertyTypes = [
  {
    name: "Entire Room",
    description:
      "Guests are able to use the entire place and do not have to share this with the host or other guests.",
  },
  {
    name: "Private Room",
    description:
      "Guests rent a room within the property. There are common areas that are either shared with the host or other guests.",
  },
];

export default function PropertyType({ onSelectedPropertyTypeChange, parentSelectedPropertyType }) {
  const [selectedPropertyType, setSelectedPropertyType] = useState(parentSelectedPropertyType);

  const handleClick = (button) => {
    const newSelectedPropertyType = selectedPropertyType === button ? null : button;
    setSelectedPropertyType(newSelectedPropertyType);
    onSelectedPropertyTypeChange(newSelectedPropertyType);
  };


  console.log("Property Type", selectedPropertyType);
  return (
    <Box mb={5} mt={-9}>
    <Box mb={5} mt={-9}>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "2rem",
            textAlign: "left",
          }}
        >
          Property Type
        </Typography>

        <Typography
          sx={{
            fontSize: "1.5rem",
            textAlign: "left",
            marginBottom: 5,
            marginTop: 0
            marginTop: 0
          }}
        >
          What guests can book?
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {propertyTypes.map((type, index) => (
            <Grid item xs={12} key={index}>
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor:
                      selectedPropertyType === type.name ? "#1780CB" : "white",
                    color: selectedPropertyType === type.name ? "white" : "black",
                      selectedPropertyType === type.name ? "#1780CB" : "white",
                    color: selectedPropertyType === type.name ? "white" : "black",
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
                      width: "270px",
                    }}
                  >
                    {type.name}
                  </Typography>
                  <Typography
                    sx={{
                      width: "100%",
                      fontSize: { xs: "0.65rem", sm: "1rem" },
                      marginLeft: { xs: 1, sm: 2 },
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
