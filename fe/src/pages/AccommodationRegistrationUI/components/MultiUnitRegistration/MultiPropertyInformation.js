import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert"; // For custom styled alert inside the snackbar
import AnimatePage from "../AnimatedPage";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Custom Alert for the Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MultiPropertyInformation({
  onMultiPropertyInformationChange,
  parentMultiPropertyInfo,
  handleNext,
  handleBack,
}) {
  const [multiPropertyData, setMultiPropertyData] = useState(parentMultiPropertyInfo);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);

  // Function to handle changes in form fields
  const handleChange = (newValue, field) => {
    setMultiPropertyData((prevState) => ({
      ...prevState,
      [field]: newValue,
    }));

    // Directly pass the property information to the parent component whenever there's a change
    if (typeof onMultiPropertyInformationChange === "function") {
      onMultiPropertyInformationChange({ ...multiPropertyData, [field]: newValue });
    }
  };

  // Validation function to check if all required fields are filled
  const validateForm = () => {
    return (
      multiPropertyData.propertyName &&
      multiPropertyData.propertyDescription &&
      multiPropertyData.gettingToProperty
    );
  };

  const validateAndProceed = () => {
    if (!validateForm()) {
      setSnackbarOpen(true); // Show snackbar when validation fails
      return;
    }
    handleNext();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  console.log("Property Information:", multiPropertyData);

  return (
    <Container maxWidth="lg" className="centered-container">
      <AnimatePage>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Paper
            sx={{
              width: '80vw',
              padding: '2rem',
              borderRadius: '0.8rem',
              boxShadow: 3,
            }}
          >
            <Typography sx={{ fontSize: "2rem" }} fontWeight="bold" mb={2}>
              Property Information
            </Typography>

            <Typography sx={{ fontSize: "1rem" }} mb={2}>
              Describe your property in detail. Highlight its unique features,
              amenities, and any additional information potential tenants or
              buyers should know.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { my: 1, width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="property-name"
                    label="Property Name"
                    helperText="How would you like to call your listing?"
                    fullWidth
                    value={multiPropertyData.propertyName}
                    onChange={(e) => handleChange(e.target.value, "propertyName")}
                  />
                  <TextField
                    id="property-description"
                    label="Property Description"
                    multiline
                    rows={4}
                    fullWidth
                    helperText="Describe your property to catch the attention of potential guests."
                    placeholder="Say something about your listing here.."
                    value={multiPropertyData.propertyDescription}
                    onChange={(e) => handleChange(e.target.value, "propertyDescription")}
                  />
                  <TextField
                    id="getting-to-property"
                    label="Getting to Your Property"
                    multiline
                    rows={4}
                    fullWidth
                    helperText="Guide your guests to your property"
                    placeholder="Please let guests know the best ways to reach your property"
                    value={multiPropertyData.gettingToProperty}
                    onChange={(e) => handleChange(e.target.value, "gettingToProperty")}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#16B4DD",
                    height: "100%",
                    borderRadius: "0.8rem",
                    padding: "1rem",
                    color: "white"
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Tips for Hosts
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocalOfferIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Make your description catchy and highlight unique features.
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <DarkModeIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Provide clear directions to your property. Include suggestions for transportation.
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarMonthIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Mention any special amenities or services you offer.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </AnimatePage>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button onClick={validateAndProceed} className="stepperNext">
          Next
        </Button>
      </div>

      {/* Snackbar for error message */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          Please fill in all fields.
        </Alert>
      </Snackbar>
    </Container>
  );
}
