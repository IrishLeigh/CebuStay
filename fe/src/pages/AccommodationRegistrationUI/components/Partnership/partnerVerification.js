import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { Divider, Grid, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import IndividualHost from './individualHost';
import CompanyHost from './companyHost';
import AnimatePage from '../AnimatedPage';

export default function PartnerVerification({ onHostDataChange, parentPartnerData, handleSubmit, handleBack, openModal }) {
  const [hostType, setHostType] = useState('');
  const [individualData, setIndividualData] = useState({});
  const [companyData, setCompanyData] = useState({});

  useEffect(() => {
    if (parentPartnerData) {
      setHostType(parentPartnerData.hostType || '');
      if (parentPartnerData.hostType === 'Individual') {
        setIndividualData(parentPartnerData);
      } else if (parentPartnerData.hostType === 'Company') {
        setCompanyData(parentPartnerData);
      }
    }
  }, [parentPartnerData]);

  const handleChange = (event) => {
    setHostType(event.target.value);
  };

  const handleIndividualDataChange = (data) => {
    setIndividualData(data);
  };

  const handleCompanyDataChange = (data) => {
    setCompanyData(data);
  };

  // useEffect(() => {
  //   const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
  //   onHostDataChange(dataToSend);
  // }, [hostType, individualData, companyData, onHostDataChange]);

  const validateAndProceed = () => {
    // Helper function to check for empty fields
    const getEmptyFields = (data) => {
      // Check if data is not an empty object
      if (Object.keys(data).length === 0) {
        return ['All fields are empty'];
      }
      return Object.keys(data).filter(key => !data[key]);
    };
  
    // Validate Individual host data
    if (hostType === 'Individual') {
      const emptyFields = getEmptyFields(individualData);
      if (emptyFields.length > 0) {
        alert(`Please fill in the following fields for the individual host: ${emptyFields.join(', ')}.`);
        return;
      }
    }
  
    // Validate Company host data
    if (hostType === 'Company') {
      const emptyFields = getEmptyFields(companyData);
      if (emptyFields.length > 0) {
        alert(`Please fill in the following fields for the company host: ${emptyFields.join(', ')}.`);
        return;
      }
    }
  
    // If no validation errors, proceed to submit the data
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
    onHostDataChange(dataToSend);
    openModal();
    alert("Successfully submitted!");
  };
  
  console.log ("hostType", hostType);
  console.log ("individualData", individualData);
  console.log ("companyData", companyData);

  return (
    <Container maxWidth="lg">
      <AnimatePage>
        <Grid container spacing={2} className="centered-container">
          <Grid item xs={6} sx={{ textAlign: "left" }}></Grid>
          <Paper
            sx={{
              width: '80vw',
              padding: '2rem',
              borderRadius: '0.8rem',
              boxShadow: 3,
            }}
          >
            <Box
              component="form"
              sx={{
                '& > :not(style)': { my: 1, width: "100%" }
              }}
              autoComplete="off"
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Accommodation Ownership
              </Typography>
              <Typography sx={{ fontFamily: "Poppins, sans-serif", mb: 2 }}>
                To ensure compliance with legal and regulatory standards, we require some information about you and your property.
              </Typography>
              <RadioGroup
                aria-labelledby="Host"
                name="host"
                value={hostType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Individual"
                  control={<Radio />}
                  label={
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", }}>
                      I am the host representing myself.
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="Company"
                  control={<Radio />}
                  label={
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", }}>
                      I represent a company.
                    </Typography>
                  }
                />
              </RadioGroup>
              <Divider sx={{ my: 2 }} />
              {hostType === 'Individual' && <IndividualHost onDataChange={handleIndividualDataChange} />}
              {hostType === 'Company' && <CompanyHost onDataChange={handleCompanyDataChange} prevData={parentPartnerData} />}
            </Box>
          </Paper>
        </Grid>
      </AnimatePage>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">Back</Button>
        <Button onClick={validateAndProceed} className="stepperNext" sx ={{ backgroundColor: "#A334CF", }}>Finish</Button>
      </div>
    </Container>
  );
}
