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



export default function PaymentMethods({ onPaymentDataChange, parentPaymentData, handleNext, handleBack }) {
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
  }, [parentPaymentData]);

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

          {/* PayPal Account Section */}
          <Typography sx={{ fontSize: "1.125rem" }} mb={2} mt={6} fontWeight="bold">PayPal Payout Account</Typography>

          <RadioGroup
            aria-labelledby="PaypalAccount"
            name="PaypalAccount"
            value={paymentData.hasPaypal}
            onChange={handlePaypalChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
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
              />
                {snackbarMessage.includes("Invalid email address.") && (
                <Typography  color="error" sx ={{ fontSize: "0.875rem"}}>
                  Invalid email address.
                </Typography>
              )}
              <Box display="flex" alignItems="center" marginBottom={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="country-code-label">Country Code</InputLabel>
                  <Select
                    labelId="country-code-label"
                    value={paymentData.paypalInfo.countryCode}
                    onChange={handleCountryCodeChange}
                    required
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
                />
              </Box>
              {paymentData.paypalInfo.mobile && !validateMobileNumber(paymentData.paypalInfo.mobile) && (
                <Typography  color="error" sx ={{ fontSize: "0.875rem"}}>
                  Invalid mobile number for the selected country code.
                </Typography>
              )}
            </div>
          )}
          {paymentData.hasPaypal === "no" && (
            <Typography sx={{ mt: 2 }}>
              You need to register for a PayPal account to receive payments. You can edit this part later.
            </Typography>
          )}
        </Box>
      </Paper>

      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">Back</Button>
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
