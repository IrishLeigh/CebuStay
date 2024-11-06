import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { Divider, Grid, RadioGroup, FormControlLabel, Radio, Button, Snackbar, useTheme, useMediaQuery } from '@mui/material';
import IndividualHost from './individualHost';
import CompanyHost from './companyHost';
import AnimatePage from '../AnimatedPage';

export default function PartnerVerification({ onHostDataChange, parentPartnerData, handleBack, openModal }) {
  const [hostType, setHostType] = useState('Individual');
  const [individualData, setIndividualData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen size is mobile
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validateAndProceed = () => {
    const fieldLabels = {
      FirstName: "First Name",
      LastName: "Last Name",
      Email: "Email Address",
      PhoneNumber: "Phone Number",
      DateOfBirth: "Date of Birth",
      DisplayName: "Display Name",
    };
  
    const legalRepresentativeFieldLabels = {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone Number",
      countryCode: "Country Code",
      position : "Position",
      dob: "Date of Birth",
    };
  
    const getEmptyFields = (data) => {
      if (Object.keys(data).length === 0) {
        return ['No information has been filled out yet.'];
      }
      return Object.keys(data).filter(key => !data[key]).map(key => fieldLabels[key] || key);
    };
  
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|info|io|co)$/;
    const phonePatterns = {
      '+1': /^\+1\d{10}$/, // USA/Canada
      '+63': /^\+63[1-9]\d{9}$/, // Philippines (10 digits, no leading 0)
      '+44': /^\+44\d{10}$/, // UK
      // Add more country codes and patterns as needed
    };
  
    // Validate Individual Host
    if (hostType === 'Individual') {
      const emptyFields = getEmptyFields(individualData);
      if (emptyFields.length > 0) {
        openSnackbar(`Please fill in the following required information for the individual host: ${emptyFields.join(', ')}.`);
        return;
      }
      const email = individualData.Email || '';
      if (!emailPattern.test(email)) {
        openSnackbar('Invalid email address. Please enter a valid email.');
        return;
      }
    }
  
    // Validate Company Host
    if (hostType === 'Company') {
      const emptyFields = getEmptyFields(companyData);
      if (emptyFields.length > 0) {
        openSnackbar(`Please provide the following required details for the company host: ${emptyFields.join(', ')}.`);
        return;
      }
  
      // Ensure all legal representatives have valid emails, phones, and other required fields
      if (companyData.legalRepresentatives && companyData.legalRepresentatives.length > 0) {
        for (let rep of companyData.legalRepresentatives) {
          // Check for empty fields in legal representative
          const repEmptyFields = Object.keys(legalRepresentativeFieldLabels).filter(key => !rep[key]);
          if (repEmptyFields.length > 0) {
            console.log("companydata" ,companyData);
            openSnackbar(`Please fill in the following required information for the legal representative: ${repEmptyFields.map(key => legalRepresentativeFieldLabels[key]).join(', ')}.`);
            return;
          }
  
          // Validate email
          if (!rep.email || !emailPattern.test(rep.email)) {
            openSnackbar(`Invalid or missing email for legal representative. Please provide a valid email.`);
            return;
          }
  
          // Validate phone
          const countryCode = rep.countryCode || '';
          const phoneNumber = rep.phone || '';
          const phoneWithCountryCode = `${countryCode}${phoneNumber}`;
          const pattern = phonePatterns[countryCode] || /^\+[1-9]\d{1,14}$/;
  
          if (!pattern.test(phoneWithCountryCode)) {
            openSnackbar(`Invalid or missing phone number for legal representative. Please provide a valid phone number.`);
            return;
          }
        }
      } else {
        openSnackbar('Please add at least one legal representative.');
        return;
      }
    }
  
    // If all validations pass
    const dataToSend = hostType === 'Individual' ? { hostType, ...individualData } : { hostType, ...companyData };
    onHostDataChange(dataToSend);
    
    openModal();
  };
  

  return (
    <Container maxWidth="lg" className="centered-container">
      <AnimatePage>
        <Grid container spacing={2} >
          <Grid item xs={6} sx={{ textAlign: "left" }}></Grid>
          <Paper
            sx={{
              // width: '80vw',
              p: isMobile ? "1rem" : "2rem",
              borderRadius: '0.8rem',
              boxShadow: 3,
            }}
          >
            <Box
              component="form"
              sx={{
                '& > :not(style)': {  width: "100%" }
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
        <Button onClick={validateAndProceed} className="stepperNext" sx={{ backgroundColor: "#A334CF", }}>Finish</Button>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
}
