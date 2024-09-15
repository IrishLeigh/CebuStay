import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import AnimatePage from "./AnimatedPage";

const propertyTypes = [
  {
    name: "Entire Property",
    description: "Guests are able to use the entire place and do not have to share this with the host or other guests.",
  },
  {
    name: "Private Room",
    description: "Guests rent a room within the property. There are common areas that are either shared with the host or other guests.",
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

  useEffect(() => {
    onSelectedPropertyTypeChange(selectedPropertyType);
  }, [selectedPropertyType, onSelectedPropertyTypeChange]);

  const handleClick = (button) => {
    setSelectedPropertyType(button);
  };

  const validateAndProceed = () => {
    if (!selectedPropertyType) {
      alert("Please select a property type.");
      return;
    }
    handleNext();
  };

  return (
    
      <Box >
        
          <Container
            maxWidth="md"
           className="centered-container"
          >
            <AnimatePage>
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
                        backgroundColor: selectedPropertyType === type.name ? "#1780CB" : "white",
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
            </AnimatePage>
            <div className="stepperFooter">
              <Button  onClick={handleBack} className="stepperPrevious">
                Back
              </Button>
              <Button  onClick={validateAndProceed} className="stepperNext">
                Next
              </Button>
            </div>
            </Container>

            
            {/* <Box mt={4} display="flex" justifyContent="space-between">
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" onClick={validateAndProceed}>
                Next
              </Button>
            </Box> */}
       
      </Box>
  );
}
