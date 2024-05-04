import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import FormPropsTextFields from '../../textfield';
import TextField from '@mui/material/TextField';

export default function SimplePaper({ onFormDataChange }) {
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

    // Call the onFormDataChange callback with updated propertyData
    if (typeof onFormDataChange === 'function') {
      onFormDataChange({ ...propertyData, [field]: newValue });
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} md={8} lg={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              mt: 12,
              mb: 12
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Property Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Describe your property in detail. Highlight its unique features, amenities, and any additional information potential tenants or buyers should know
            </Typography>
            <Paper elevation={3} sx={{ p: "2rem" ,maxWidth:'32rem'}}>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { my: 1, width: "100%" } // Set width of children to 100%
                }}
                noValidate
                autoComplete="off"
              >
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
        </Grid>
      </Grid>
    </Container>
  );
}
