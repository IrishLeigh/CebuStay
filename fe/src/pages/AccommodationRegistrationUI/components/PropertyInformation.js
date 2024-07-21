import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AnimatePage from "./AnimatedPage";

export default function PropertyInformation({
  onPropertyInformationChange,
  parentPropertyInfo,
  handleNext,
  handleBack,
}) {
  const [propertyData, setPropertyData] = useState(parentPropertyInfo);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);
  // Function to handle changes in form fields
  const handleChange = (newValue, field) => {
    setPropertyData((prevState) => ({
      ...prevState,
      [field]: newValue,
    }));

    // Directly pass the property information to the parent component whenever there's a change
    if (typeof onPropertyInformationChange === "function") {
      onPropertyInformationChange({ ...propertyData, [field]: newValue });
    }
  };

  // Validation function to check if all required fields are filled
  const validateForm = () => {
    return (
      propertyData.propertyName &&
      propertyData.propertyDescription &&
      propertyData.numberOfUnits &&
      propertyData.gettingToProperty
    );
  };

  const validateAndProceed = () => {
    if (!validateForm()) {
      alert("Please fill in all fields.");
      return;
    }
    handleNext();
  };

  console.log("Property Information:", propertyData);

  return (
    <Container maxWidth="lg" className="centered-container">
      <AnimatePage>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12} md={8} lg={6}>
            
            <Box>
              <Typography sx={{ fontSize: "2rem" }} fontWeight="bold" mb={2}>
                Property Information
              </Typography>

              <Typography sx={{ fontSize: "1rem" }} mb={2}>
                Describe your property in detail. Highlight its unique features,
                amenities, and any additional information potential tenants or
                buyers should know.
              </Typography>

              <Paper elevation={3} sx={{ p: "2rem", maxWidth: "32rem" }}>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { my: 1, width: "100%" }, // Set width of children to 100%
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="property-name"
                    label="Property Name"
                    error={!propertyData.propertyName}
                    helperText={!propertyData.propertyName && "Property Name is required"}
                    fullWidth
                    value={propertyData.propertyName}
                    onChange={(e) => handleChange(e.target.value, "propertyName")}
                  />
                  <TextField
                    id="property-description"
                    label="Property Description"
                    multiline
                    rows={6}
                    fullWidth
                    error={!propertyData.propertyDescription}
                    helperText={!propertyData.propertyDescription && "Property Description is required"}
                    placeholder="Say something about your listing here.."
                    value={propertyData.propertyDescription}
                    onChange={(e) => handleChange(e.target.value, "propertyDescription")}
                  />
                  <TextField
                    type="number"
                    id="number-of-units"
                    label="Number of Units"
                    error={!propertyData.numberOfUnits}
                    helperText={!propertyData.numberOfUnits && "Number of Units is required"}
                    fullWidth
                    value={propertyData.numberOfUnits}
                    onChange={(e) => handleChange(e.target.value, "numberOfUnits")}
                  />
                  <TextField
                    id="getting-to-property"
                    label="Getting to Your Property"
                    multiline
                    rows={6}
                    fullWidth
                    error={!propertyData.gettingToProperty}
                    helperText={!propertyData.gettingToProperty && "Getting to Your Property is required"}
                    placeholder="Please let guests know the best ways to reach your property"
                    value={propertyData.gettingToProperty}
                    onChange={(e) => handleChange(e.target.value, "gettingToProperty")}
                  />
                </Box>
              </Paper>

            
            </Box>
          </Grid>
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
  );
}
