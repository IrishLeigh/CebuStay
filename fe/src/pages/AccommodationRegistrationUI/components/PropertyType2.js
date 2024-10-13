import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid, useMediaQuery } from "@mui/material"; // Import useMediaQuery
import AnimatePage from "./AnimatedPage";

const propertyTypes = [
  {
    icon: "/EntireProperty.png",
    name: "Daily Term",
    description: "Guests can book stays ranging from 1 to 31 days, perfect for short getaways or business trips.",
  },
  {
    icon: "/PrivateRoom.png",
    name: "Monthly Term",
    description: "Guests can book longer stays, typically from 1 month to a year, ideal for extended visits or relocation.",
  },
];

export default function PropertyType2({
  onSelectedPropertyTypeChange,
  parentSelectedPropertyType,
  handleNext,
  handleBack,
}) {
  const initialType = parentSelectedPropertyType || propertyTypes[0].name;
  const [selectedPropertyType, setSelectedPropertyType] = useState(initialType);

  // Media query to check if the screen size is small
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    onSelectedPropertyTypeChange(selectedPropertyType);
  }, [selectedPropertyType, onSelectedPropertyTypeChange]);

  // Make the screen at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClick = (button) => {
    setSelectedPropertyType(button);
  };

  const validateAndProceed = () => {
    if (!selectedPropertyType) {
      alert("Please select a property term.");
      return;
    }
    handleNext();
  };

  return (
    <Box>
      <Container maxWidth="md" className="centered-container">
        <AnimatePage>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "2rem",
              textAlign: "left",
            }}
          >
            Property Term
          </Typography>

          <Typography
            sx={{
              fontSize: "1.5rem",
              textAlign: "left",
              marginBottom: 5,
            }}
          >
            The term is all about how long guests can book a stay—whether it’s for a quick getaway or a longer adventure!
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {propertyTypes.map((type, index) => (
              <Grid item xs={12} key={index}>
                <Box>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedPropertyType === type.name ? "#1780CB" : "white",
                      color: selectedPropertyType === type.name ? "white" : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: "100%",
                      height: 80,
                      "&:hover": { backgroundColor: "#16B4DD", color: "white" },
                    }}
                    startIcon={
                      <img
                        src={type.icon}
                        alt={type.name}
                        style={{
                          width: "60px",
                          height: "60px",
                        }}
                        onError={() => console.error(`Image failed to load: ${type.icon}`)}
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
                    {/* Conditionally render the description based on the screen size */}
                    {!isSmallScreen && (
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
                    )}
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </AnimatePage>
        <div className="stepperFooter">
          <Button onClick={handleBack} className="stepperPrevious">
            Back
          </Button>
          <Button onClick={validateAndProceed} className="stepperNext">
            Next
          </Button>
        </div>
      </Container>
    </Box>
  );
}
