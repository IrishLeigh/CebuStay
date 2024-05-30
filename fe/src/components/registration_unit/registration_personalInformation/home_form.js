import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import FormPropsTextFields from "../../textfield";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function SimplePaper({ onPropertyInformationChange, parentPropertyInfo }) {
  const [propertyData, setPropertyData] = useState(parentPropertyInfo);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Function to check if all fields are filled
  const validateForm = () => {
    return (
      propertyData.propertyName &&
      propertyData.propertyDescription &&
      propertyData.numberOfUnits &&
      propertyData.gettingToProperty
    );
  };

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


  console.log("Property Information suood:", propertyData);

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} md={8} lg={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              mt: "4rem",
              mb: "8rem",
            }}
          >
            <Typography sx={{ fontSize: "2rem" }} fontWeight="bold" mb={2}>
              Property Information
            </Typography>

            <Typography sx={{ fontSize: "1rem" }} mb={2}>
              Describe your property in detail. Highlight its unique features,
              amenities, and any additional information potential tenants or
              buyers should know
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
                  placeholder="Say Something about your listing here.."
                  value={propertyData.propertyDescription}
                  onChange={(e) => handleChange(e.target.value, "propertyDescription")}
                />
                <TextField
                  type = "number"
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
            {/* Snackbar for form validation */}
            <Snackbar
              open={!validateForm()}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={() => setOpenSnackbar(false)}
                severity="error"
              >
                Please fill in all fields.
              </MuiAlert>
            </Snackbar>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
