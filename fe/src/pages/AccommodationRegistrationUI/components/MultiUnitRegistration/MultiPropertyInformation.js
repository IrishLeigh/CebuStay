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
import { useMediaQuery, useTheme } from "@mui/material";

// Alert component
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen size is mobile
  const [errorMessages, setErrorMessages] = useState({}); // State for error messages

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);

  // Function to handle changes in form fields
  const handleChange = (newValue, field) => {
    setMultiPropertyData((prevState) => ({
      ...prevState,
      [field]: newValue,
    }));

    // Clear the specific error message for the field being changed
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [field]: '', // Clear the error message for the current field
    }));

    // Directly pass the property information to the parent component whenever there's a change
    if (typeof onMultiPropertyInformationChange === "function") {
      onMultiPropertyInformationChange({ ...multiPropertyData, [field]: newValue });
    }
  };

  const validateForm = () => {
    const newErrorMessages = {};
  
    // Check if property name is empty
    if (multiPropertyData.propertyName === '' || typeof multiPropertyData.propertyName !== 'string') {
      newErrorMessages.propertyName = 'Please enter a property name.';
    }
    
    if (multiPropertyData.propertyDescription === '' || typeof multiPropertyData.propertyDescription !== 'string') {
      newErrorMessages.propertyDescription = 'Please enter a property description.';
    }
   
  
    // Check if getting to property description is empty
    if (multiPropertyData.gettingToProperty === '' || typeof multiPropertyData.gettingToProperty !== 'string') {
      newErrorMessages.gettingToProperty = 'Please provide details on how to get to the property.';
    }
  
    // Update state with new error messages
    setErrorMessages(newErrorMessages);
  
    // If there are errors, show the alert and return false
    if (Object.keys(newErrorMessages).length > 0) {
      setSnackbarOpen(true); // Show snackbar when validation fails
      return false;
    }
  
    // Return true if there are no error messages
    return true;
  };
  

  const validateAndProceed = () => {
    // Validate form and get the validation result
    const isValid = validateForm();
    
    // If the form is not valid, open the snackbar and stop the function
    if (!isValid) {
        setSnackbarOpen(true); // Show snackbar when validation fails
        return;
    }

    // Proceed to the next step if validation passed
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
    <Container maxWidth="md" className="centered-container">
      <AnimatePage>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Paper
            sx={{
              // width: '80vw',
              padding: isMobile ? "1rem" : "2rem", // No padding for mobile
              borderRadius: '0.8rem',
              boxShadow: 3,
            }}
          >
            <Typography sx={{ fontSize: "2rem" }} fontWeight="bold" mb={2}>
              Basic Information
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
                    "& > :not(style)": {  width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Box mb={2}>
                    <TextField
                      id="property-name"
                      label="Property Name"
                      helperText="How would you like to call your listing?"
                      fullWidth
                      value={multiPropertyData.propertyName}
                      onChange={(e) => handleChange(e.target.value, "propertyName")}
                    />
                    {errorMessages.propertyName && (
                      <Typography color="error" sx={{  m: "0 0 1rem 15px ", fontSize: "0.8rem" }}>
                        {errorMessages.propertyName}
                      </Typography>
                    )}

                  </Box>
                 
                  <Box mb={2}>
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
                    {errorMessages.propertyDescription && (
                      <Typography color="error" sx={{ m: "0 0 1rem 15px ", fontSize: "0.8rem" }}>
                        {errorMessages.propertyDescription}
                      </Typography>
                    )}

                  </Box>
                  <Box mb={2}>
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
                    {errorMessages.gettingToProperty && (
                      <Typography color="error"  sx={{ m: "0 0 1rem 15px ", fontSize: "0.8rem" }}>
                        {errorMessages.gettingToProperty}
                      </Typography>
                    )}

                  </Box>
                 
                 
                </Box>
              </Grid>
              {!isMobile && (
                <Grid item xs={12} md={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#16B4DD",
                      height: "100%",
                      borderRadius: "0.8rem",
                      padding: "1rem",
                      color: "white",
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
              )}

            </Grid>
          </Paper>
        </Box>
      </AnimatePage>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious" sx={{ backgroundColor: '#6c757d', color: '#fff' }}>
          Back
        </Button>
        <Button onClick={validateAndProceed} className="stepperNext" >
          Next
        </Button>
      </div>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at top right
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Please fill in all fields.
        </Alert>
      </Snackbar>
    </Container>
  );
}
