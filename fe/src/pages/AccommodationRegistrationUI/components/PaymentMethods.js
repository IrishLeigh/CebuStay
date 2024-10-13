import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { RadioGroup, TextField, useMediaQuery, useTheme } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaymentIcon from '@mui/icons-material/Payment';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Create Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PaymentMethods({ onPaymentDataChange, parentPaymentData, handleNext, handleBack }) {
  const [paymentData, setPaymentData] = useState({
    selectedPayment: 'Online',
    selectedPayout: 'Paypal',
    hasPaypal: 'yes',
    paypalInfo: {
      email: '',
      mobile: ''
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
        }
      }));
    }
  }, [parentPaymentData]);

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

  // Proceed to the next step if validation is successful
  const validateAndProceed = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
    const phonePattern = /^[0-9]{10,}$/; // Pattern for a valid phone number (at least 10 digits)

    if (paymentData.hasPaypal === "yes") {
      const { email, mobile } = paymentData.paypalInfo;

      if (!emailPattern.test(email)) {
        openSnackbar("Please enter a valid email address.", "error");
        return;
      }

      if (!mobile || !phonePattern.test(mobile)) {
        openSnackbar("Please enter a valid mobile number.", "error");
        return;
      }
    }

    if (paymentData.selectedPayout !== "") {
      handleNext();
    } else {
      openSnackbar("Please select both payment and payout methods.", "error");
    }
  };

  console.log("Payment Data HERE:", paymentData);

  return (
    <Container maxWidth="lg"  className='centered-container'>
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

          {/* Information about Online Payment */}
          <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#16B4DD", padding: "1rem", borderRadius: "0.8rem", color: "white" }}>
            <Typography variant="h6" gutterBottom>Online Payment</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <LocalOfferIcon sx={{ mr: 1 }} />
              <Typography variant="body2">Your future guests can pay the full amount online through CebuStay.</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <DarkModeIcon sx={{ mr: 1 }} />
              <Typography variant="body2">CebuStay offers a wide range of payment methods.</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <PaymentIcon sx={{ mr: 1 }} />
              <Typography variant="body2">We payout to you at the end of each month.</Typography>
            </Box>
          </Box>

          {/* PayPal Account Section */}
          <Typography sx={{ fontSize: "1.125rem" }} mb={2} mt={6} fontWeight="bold">PayPal Payout Account</Typography>
          <Typography sx={{ fontSize: "1rem" }} mb={2} mt={1}>
            Our accommodation handles payouts through PayPal. For security reasons, your initial payout will be processed 30 days after the check-out date of your first booking.
          </Typography>

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
              <TextField
                label="PayPal Mobile Number"
                name="mobile"
                value={paymentData.paypalInfo.mobile || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
            </div>
          )}
          {paymentData.hasPaypal === "no" && (
            <Typography sx={{ mt: 2 }}>
              You need to register for a PayPal account to receive payments.You can edit this part later.
            </Typography>
          )}
        </Box>
      </Paper>

      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">Back</Button>
        <Button onClick={validateAndProceed} className="stepperNext">Next</Button>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
