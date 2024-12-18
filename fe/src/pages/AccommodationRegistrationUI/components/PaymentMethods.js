import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { Alert, FormControl, InputLabel, MenuItem, RadioGroup, Select, TextField, useMediaQuery, useTheme } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaymentIcon from '@mui/icons-material/Payment';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import countryCodesWithPatterns from '../../../components/Booking/countryCodes';




export default function PaymentMethods({ onPaymentDataChange, parentPaymentData,parentPayPalData, handleNext, handleBack }) {
  const [paymentData, setPaymentData] = useState({
    selectedPayment: 'Online',
    selectedPayout: 'Paypal',
    hasPaypal: 'yes',
    paypalInfo: {
      email: '',
      mobile: '',
      countryCode: '+63'
    }
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen size is mobile
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  // Set initial state based on parentPaymentData
  useEffect(() => {
    if (parentPayPalData) {
      setPaymentData((prev) => ({
        ...prev,
        hasPaypal: "yes",
        paypalInfo: {
          email: parentPayPalData.paypalInfo?.email || prev.paypalInfo.email,
          mobile: parentPayPalData.paypalInfo?.mobile || prev.paypalInfo.mobile,
          countryCode: parentPayPalData.paypalInfo?.countryCode || prev.paypalInfo.countryCode
        }
      }));
    }
    if (parentPaymentData) {
      setPaymentData((prev) => ({
        ...prev,
        selectedPayment: parentPaymentData.selectedPayment || prev.selectedPayment,
        selectedPayout: parentPaymentData.selectedPayout || prev.selectedPayout,
        hasPaypal: parentPaymentData.hasPaypal || prev.hasPaypal,
        paypalInfo: {
          email: parentPaymentData.paypalInfo?.email || prev.paypalInfo.email,
          mobile: parentPaymentData.paypalInfo?.mobile || prev.paypalInfo.mobile,
          countryCode: parentPaymentData.paypalInfo?.countryCode || prev.paypalInfo.countryCode
        }
      }));
    }
  }, [parentPaymentData, parentPayPalData]);
  const isPaypalInfoAvailable = parentPayPalData.paypalInfo.email !== '' || parentPayPalData.paypalInfo.mobile  !== '';

  // Handle country code change
  const handleCountryCodeChange = (event) => {
    const newPaymentData = {
      ...paymentData,
      paypalInfo: {
        ...paymentData.paypalInfo,
        countryCode: event.target.value
      }
    };
    setPaymentData(newPaymentData);
    onPaymentDataChange(newPaymentData);
  };

  // Handle changes in payment method
  const handlePaymentChange = (event) => {
    const newPaymentData = { ...paymentData, selectedPayment: event.target.value };
    setPaymentData(newPaymentData);
    onPaymentDataChange(newPaymentData);
  };

  // Handle changes in payout method
  const handlePayoutChange = (event) => {
    const newPaymentData = { ...paymentData, selectedPayout: event.target.value };
    setPaymentData(newPaymentData);
    onPaymentDataChange(newPaymentData);
  };

  // Handle changes in PayPal availability
  const handlePaypalChange = (event) => {
    const newPaymentData = { ...paymentData, hasPaypal: event.target.value };
    setPaymentData(newPaymentData);
    onPaymentDataChange(newPaymentData);
  };

  // Handle input changes for PayPal info
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newPaymentData = {
      ...paymentData,
      paypalInfo: {
        ...paymentData.paypalInfo,
        [name]: value
      }
    };
    setPaymentData(newPaymentData);
    onPaymentDataChange(newPaymentData);
  };

  // Open Snackbar function
  const openSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

 
  // Validate mobile number based on selected country code pattern
  const validateMobileNumber = (mobile) => {
    const selectedCountry = countryCodesWithPatterns[paymentData.paypalInfo.countryCode];
    return selectedCountry && selectedCountry.pattern.test(mobile);
  };

  // Validate and proceed to the next step
  const validateAndProceed = () => {
    const { email, mobile } = paymentData.paypalInfo;
    if( paymentData.hasPaypal === 'no') return handleNext();
    // Validate email and mobile number
    if (!email) {
      setSnackbarMessage("Email is required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setSnackbarMessage("Invalid email address.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!validateMobileNumber(mobile)) {
      setSnackbarMessage("Invalid mobile number for the selected country code.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // If validation passes, call handleNext
    handleNext();
  };

  console.log("Payment Data HERE:", paymentData);
  console.log("Parent paypal Data HERE:", parentPayPalData);

  return (
    <Container maxWidth="md"  className='centered-container'>
     <Paper elevation={3} 
        sx={{ 
            p: isMobile ? "1rem" : "2rem", // No padding for mobile
            width: "100%", 
            borderRadius: "0.8rem", 
            boxShadow: 3 }}>
        <Box component="form" sx={{ '& > :not(style)': { my: 1, width: "100%" } }} autoComplete="off">
          <Typography sx={{ fontSize: "2rem", fontFamily: "Poppins, sans-serif", mb: 2 }} fontWeight="bold">
            Payment Methods
          </Typography>

          <Typography sx={{ fontSize: "1.125rem" }} mb={2} fontWeight="bold">
            How can your guests pay for their stay?
          </Typography>
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
            <Box sx={{ my: 1, display: 'flex', alignItems: 'center' }}>
              <PaymentIcon sx={{ fontSize: '1.125rem', color: '#fff', mr: 2 }} />
              <Typography  sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Guests can pay through our secure payment gateway for their stay. 
                Payments will be processed securely and can be claimed via your PayPal account.
              </Typography>
            </Box>

            <Box sx={{ my: 1, display: 'flex', alignItems: 'center' }}>
              <LocalOfferIcon sx={{ fontSize: '1.125rem', color: '#fff', mr: 2 }} />
              <Typography  sx={{ fontFamily: 'Poppins, sans-serif' }}>
                Payouts will be released after guest checkout, ensuring a smooth and reliable transaction process.
              </Typography>
            </Box>

            <Box sx={{ my: 1, display: 'flex', alignItems: 'center' }}>
              <DarkModeIcon sx={{ fontSize: '1.125rem', color: '#fff', mr: 2 }} />
              <Typography  sx={{ fontFamily: 'Poppins, sans-serif' }}>
                No PayPal account yet? No worries! You can set this up later at your convenience.
              </Typography>
            </Box>

          </Box>
          
          {/* PayPal Account Section */}
          <Typography sx={{ fontSize: "1.125rem" }} mb={2} mt={6} fontWeight="bold">Do you have PayPal Payout Account?</Typography>

          <RadioGroup
            aria-labelledby="PaypalAccount"
            name="PaypalAccount"
            value={paymentData.hasPaypal}
            onChange={handlePaypalChange}
            
          >
            <FormControlLabel value="yes" control={<Radio  disabled={isPaypalInfoAvailable}/>} label="Yes" />
            <FormControlLabel value="no" control={<Radio disabled={isPaypalInfoAvailable}/>} label="No" />
            
          </RadioGroup>


          {paymentData.hasPaypal === "yes" && (
            <div>
              <TextField
                label="PayPal Email"
                name="email"
                value={paymentData.paypalInfo.email || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                disabled={isPaypalInfoAvailable}
              />
                {snackbarMessage.includes("Invalid email address.") && (
                <Typography  color="error" sx ={{ fontSize: "0.875rem"}}>
                  Invalid email address.
                </Typography>
              )}
              <Box display="flex" alignItems="center" marginBottom={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="country-code-label" sx={{ backgroundColor: "white" }}>Country Code</InputLabel>
                  <Select
                    labelId="country-code-label"
                    value={paymentData.paypalInfo.countryCode}
                    onChange={handleCountryCodeChange}
                    required
                    disabled={isPaypalInfoAvailable}
                  >
                    {Object.entries(countryCodesWithPatterns).map(([code, { name }]) => (
                      <MenuItem key={code} value={code}>
                        {name} ({code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="PayPal Mobile Number"
                  name="mobile"
                  value={paymentData.paypalInfo.mobile || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                  disabled={isPaypalInfoAvailable}
                />
              </Box>
              {paymentData.paypalInfo.mobile && !validateMobileNumber(paymentData.paypalInfo.mobile) && (
                <Typography  color="error" sx ={{ fontSize: "0.875rem"}}>
                  Invalid mobile number for the selected country code.
                </Typography>
              )}
            </div>
          )}
          {/* Add existing PayPal message and disable fields if already set */}
          {isPaypalInfoAvailable && (
            <Typography color="warning" sx={{ fontSize: "1rem", mt: 2 }}>
              There is already an existing PayPal account. If you want to change it, edit in Host Settings {'>'} Payouts {'>'} PayPal Accounts.
            </Typography>
          )}
          {paymentData.hasPaypal === "no" && (
            <Typography sx={{ mt: 2 }}>
              You need to register for a PayPal account to receive payments. You can edit this part later.
            </Typography>
          )}
        </Box>
      </Paper>

      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious"  sx={{ backgroundColor: '#6c757d', color: '#fff' }}>Back</Button>
        <Button onClick={validateAndProceed} className="stepperNext">Next</Button>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
