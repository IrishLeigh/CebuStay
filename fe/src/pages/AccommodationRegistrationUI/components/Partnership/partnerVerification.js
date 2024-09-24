import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { Divider, Grid, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import IndividualHost from './individualHost';
import CompanyHost from './companyHost';
import AnimatePage from '../AnimatedPage';
import { Crop } from '@mui/icons-material';
import { Last } from 'react-bootstrap/esm/PageItem';

export default function PartnerVerification({ onHostDataChange, parentPartnerData, handleBack, openModal }) {
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
    const fieldLabels = {
      FirstName: "First Name",
      LastName: "Last Name",
      Email: "Email Address",
      PhoneNumber: "Phone Number",
      DateOfBirth: "Date of Birth",
      DisplayName: "Display Name",
    };
  
    const getEmptyFields = (data) => {
      if (Object.keys(data).length === 0) {
        return ['No information has been filled out yet.'];
      }
      return Object.keys(data).filter(key => !data[key]).map(key => fieldLabels[key] || key);
    };
  
    const email = individualData.Email || companyData.legalRepresentatives[0].email;
    const phoneNumber = individualData.PhoneNumber || companyData.legalRepresentatives[0].phone;
    const countryCode = individualData.countryCode || companyData.countryCode;
  
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|info|io|co)$/;
  
    const phonePatterns = {
      '+1': /^\+1\d{10}$/, // USA/Canada
      '+63': /^\+63[1-9]\d{9}$/, // Philippines (10 digits, no leading 0)
      '+44': /^\+44\d{10}$/, // UK
      // Add more country codes and patterns as needed
    };
  
    // Validate empty fields
    if (hostType === 'Individual') {
      const emptyFields = getEmptyFields(individualData);
      if (emptyFields.length > 0) {
        alert(`Please fill in the following required information for the individual host: ${emptyFields.join(', ')}.`);
        return;
      }
    } else if (hostType === 'Company') {
      const emptyFields = getEmptyFields(companyData);
      if (emptyFields.length > 0) {
        alert(`Please provide the following required details for the company host: ${emptyFields.join(', ')}.`);
        return;
      }
    }
  
    // Email validation
    if (!emailPattern.test(email)) {
      alert('Invalid email address. Please enter a valid email.');
      console.log("Email",email);
      return;
    }
  
    // Phone number validation
    const phoneWithCountryCode = `${countryCode}${phoneNumber}`;
    const pattern = phonePatterns[countryCode] || /^\+[1-9]\d{1,14}$/;  // Default pattern
  
    if (!pattern.test(phoneWithCountryCode)) {
      alert('Invalid phone number. Please enter a valid phone number.');
      return;
    }
  
    // If all validations pass
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
    onHostDataChange(dataToSend);
    openModal();
    // alert("Successfully submitted!");
  };
  
  console.log ("hostType", hostType);
  console.log ("individualData from parent", individualData);
  console.log ("companyData from parent", companyData);

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
