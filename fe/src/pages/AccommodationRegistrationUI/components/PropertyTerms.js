import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { CalendarToday, Apartment } from "@mui/icons-material"; // Import MUI icons

const propertyTypes = [
  {
    name: "Daily Term",
    description: "Guests can book from 1 to 31 days.",
    icon: <CalendarToday />, // Use MUI icon
  },
  {
    name: "Monthly Term",
    description: "Guests can book for longer stays, typically over 31 days.",
    icon: <Apartment />, // Use MUI icon
  },
];

export default function PropertyTerms({ onSelectedPropertyTypeChange, parentSelectedPropertyType }) {
  const [selectedPropertyType, setSelectedPropertyType] = useState(parentSelectedPropertyType);

  const handleClick = (button) => {
    const newSelectedPropertyType = selectedPropertyType === button ? null : button;
    setSelectedPropertyType(newSelectedPropertyType);
    onSelectedPropertyTypeChange(newSelectedPropertyType);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log("Property Type", selectedPropertyType);
  return (
    <Box mb={5} mt={-11}>
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
                    fontFamily: "Poppins, sans-serif",
                    width: "100%",
                    height: 80,
                    "&:hover": { backgroundColor: "#16B4DD", color: "white" },
                  }}
                  startIcon={type.icon} // Use MUI icon here
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
