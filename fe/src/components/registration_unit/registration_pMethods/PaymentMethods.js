import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { RadioGroup } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export default function PaymentMethods({ onPaymentDataChange }) {
  const [paymentData, setPaymentData] = useState(() => {
    const savedPaymentData = localStorage.getItem('paymentData');
    return savedPaymentData ? JSON.parse(savedPaymentData) : {
      selectedPayment: '',
      selectedPayout: ''
    };
  });

  const handleChange = (event) => {
    const newPaymentData = {
      ...paymentData,
      selectedPayment: event.target.value
    };
    setPaymentData(newPaymentData);
    localStorage.setItem('paymentData', JSON.stringify(newPaymentData));
    onPaymentDataChange(newPaymentData);
  };

  const handlePayout = (event) => {
    const newPaymentData = {
      ...paymentData,
      selectedPayout: event.target.value
    };
    setPaymentData(newPaymentData);
    localStorage.setItem('paymentData', JSON.stringify(newPaymentData));
    onPaymentDataChange(newPaymentData);
  };

  useEffect(() => {
    onPaymentDataChange(paymentData);
  }, []);

  return (
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
              Payment Methods
            </Typography>

            <Typography sx={{ fontSize: "1.5rem", width: "100%" }} mb={2} >
              Idk here yet.
            </Typography>
          </div>
        </Box>

        <Paper elevation={3} sx={{ p: "2rem", width: "100%" }}>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { my: 1, width: "100%" }
            }}
            autoComplete="off"
          >
            <div>
              <Typography sx={{ fontSize: "1.125rem" }} mb={2} fontWeight="bold">
                How can your guests pay for their stay?
              </Typography>
              <RadioGroup
                aria-labelledby="Payment"
                name="Payment"
                value={paymentData.selectedPayment}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Online"
                  control={<Radio />}
                  label={
                    <Typography fontWeight="bold">
                      Online Payment
                    </Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  CebuStay facilitates payments, allowing guests to conveniently pay the full amount online.
                </Typography>

                <FormControlLabel
                  value="Flexible"
                  control={<Radio />}
                  label={
                    <Typography fontWeight="bold">
                      Flexible Payment
                    </Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  Pay just 50% upfront and settle the remainder conveniently in cash upon your arrival.
                </Typography>
              </RadioGroup>
            </div>

            <div>
              <Typography sx={{ fontSize: "1.125rem" }} mb={2} mt={6} fontWeight="bold">
                How does your accommodation prefer to receive its payout?
              </Typography>
              <Typography sx={{ fontSize: "1rem" }} mb={2} mt={1}>
                Please choose your preferred payout method. Additional details will be required upon publication on our platform. [Important note] For security reasons, your initial payout will be processed 30 days after the check-out date of your first booking. Subsequent payouts for future bookings will be processed 24 hours after the traveler's check-out date
              </Typography>
              <RadioGroup
                aria-labelledby="Payout"
                name="Payout"
                value={paymentData.selectedPayout}
                onChange={handlePayout}
              >
                <FormControlLabel
                  value="Bank"
                  control={<Radio />}
                  label={
                    <Typography fontWeight="bold">
                      Local Bank Transfer (Philippine Banks)
                    </Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  Opt for seamless transactions with payments deposited directly into your Philippine bank account.
                </Typography>

                <FormControlLabel
                  value="Gcash"
                  control={<Radio />}
                  label={
                    <Typography fontWeight="bold">
                      GCash Transfer
                    </Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  Get your payments swiftly and securely deposited into your GCash wallet.
                </Typography>

                <FormControlLabel
                  value="Paypal"
                  control={<Radio />}
                  label={
                    <Typography fontWeight="bold">
                      PayPal Deposit
                    </Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  Receive your payments directly into your PayPal account for easy management.
                </Typography>
              </RadioGroup>
            </div>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
