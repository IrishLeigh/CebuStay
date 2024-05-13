import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import FormPropsTextFields from '../../textfield';
import TextField from '@mui/material/TextField';
import '../../../components/Button/NextButton.css'
import { Button } from '@mui/material';
export default function SimplePaper({ onPropertyInformationChange }) {
<<<<<<< HEAD
=======
import Grid from "@mui/material/Grid";
import FormPropsTextFields from "../../textfield";
import TextField from "@mui/material/TextField";

export default function SimplePaper({ onPropertyDataChange }) {
>>>>>>> b13dcc5 (BERT IT IS UP TO YOU NOW)
=======
>>>>>>> a79df4a (Initial Booking Registration with minor changes)
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    propertyDescription: '',
    numberOfUnits: '',
    gettingToProperty: ''
  });

  const handleChange = (newValue, field) => {
    setPropertyData(prevState => ({
      ...prevState,
      [field]: newValue
    }));
<<<<<<< HEAD
<<<<<<< HEAD
=======

    // Call the onPropertyDataChange callback with updated propertyData
    if (typeof onPropertyDataChange === "function") {
      onPropertyDataChange({ ...propertyData, [field]: newValue });
      onPropertyDataChange({ ...propertyData });
    }
>>>>>>> b13dcc5 (BERT IT IS UP TO YOU NOW)
=======
>>>>>>> a79df4a (Initial Booking Registration with minor changes)
  };

  const handleSave = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    
    // Call the onPropertyInformationChange callback with the updated propertyData object
    if (typeof onPropertyInformationChange === 'function') {
      onPropertyInformationChange(propertyData);
    }
  
    console.log("Property info: ", propertyData);
  };
  

  return (
<<<<<<< HEAD
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} md={8} lg={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
<<<<<<< HEAD
              mt: 15,
              mb: 15
=======
              mt: 12,
              mb: 12,
>>>>>>> b13dcc5 (BERT IT IS UP TO YOU NOW)
            }}
          >
             <Typography sx={{ fontSize: "2rem" }} fontWeight="bold" mb={2}>
              Property Information
            </Typography>
<<<<<<< HEAD
        
            <Typography sx={{ fontSize: "1rem" }} mb={2}>
              Describe your property in detail. Highlight its unique features, amenities, and any additional information potential tenants or buyers should know
=======
            <Typography variant="body1" sx={{ mb: 2 }}>
              Describe your property in detail. Highlight its unique features,
              amenities, and any additional information potential tenants or
              buyers should know
>>>>>>> b13dcc5 (BERT IT IS UP TO YOU NOW)
=======
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          mt: 12,
          mb: 12
        }}
      >
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">
              Property Information
            </Typography>

            <Typography sx={{ fontSize: "1.5rem",width: "100%" }} mb={2} >
              Describe your property in detail. 
>>>>>>> a79df4a (Initial Booking Registration with minor changes)
            </Typography>
          </div>
          <div className='nextButton-container'>
              <button className="nextButton" onClick={handleSave} >Save</button>
          </div>
        </Box>
        
          <Paper elevation={3} sx={{ p: "2rem", width: "100%" }}>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { my: 1, width: "100%" } // Set width of children to 100%
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSave} // Attach onSubmit event to handleSave function
              >
                <Typography sx={{ fontSize: "1.125rem" }} mb={4} mt={2}>
                  Highlight your unit's unique features, amenities, and any additional information potential tenants or buyers should know
                </Typography>

                <FormPropsTextFields
                  name="Property Name"
                  width="100%"
                  value={propertyData.propertyName}
                  onChange={(value) => handleChange(value, 'propertyName')}
                />
                <TextField
                  id="property-description"
                  label="Property Description"
                  multiline
                  rows={6}
                  sx={{ width: '100%' }} // Set width to 100%
                  placeholder="Say Something about your listing here.." 
                  value={propertyData.propertyDescription} // Add value prop here
                  onChange={(e) => handleChange(e.target.value, 'propertyDescription')}
                />
                <FormPropsTextFields
                  name="Number of Units"
                  width="100%"
                  value={propertyData.numberOfUnits} // Add value prop here
                  onChange={(value) => handleChange(value, 'numberOfUnits')}
                />
                <TextField
                  id="getting-to-property"
                  label="Getting to Your Property"
                  multiline
                  rows={6}
                  sx={{ width: '100%' }} // Set width to 100%
                  placeholder="Please let guests know the best ways to reach your property" 
                  value={propertyData.gettingToProperty} // Add value prop here
                  onChange={(e) => handleChange(e.target.value, 'gettingToProperty')}
                />
                 
              </Box>
            </Paper>
            
          </Box>
       
    </Container>
  );
}
