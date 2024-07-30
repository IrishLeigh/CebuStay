import React, { useState, useEffect } from "react";
import {
  Grid,
  InputLabel,
  TextField,
  Box,
  Typography,
  Paper,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

export default function PricePayment({
  isEditing,
  onUnitPricingChange,
  parentUnitPricing = {},
  onPaymentDataChange,
  parentPaymentData = {},
}) {
  const pesoSign = "\u20B1";
  const [priceEntered, setPriceEntered] = useState(false);
  const [basePrice, setBasePrice] = useState(parentUnitPricing.basePrice || "");
  const [priceUnit, setPriceUnit] = useState({
    basePrice: parentUnitPricing.basePrice || "",
    profit: "",
  });
  const [paymentData, setPaymentData] = useState({
    selectedPayment: parentPaymentData.selectedPayment || "",
    selectedPayout: parentPaymentData.selectedPayout || "",
  });

  useEffect(() => {
    // Update state when parent data changes
    setBasePrice(parentUnitPricing.basePrice || "");
    setPaymentData({
      selectedPayment: parentPaymentData.selectedPayment || '',
      selectedPayout: parentPaymentData.selectedPayout || ''
    });
  }, [parentUnitPricing, parentPaymentData]);

  useEffect(() => {
    const profitValue = calculateProfit(Number(basePrice));
    setPriceUnit({ basePrice, profit: profitValue });
    if (onUnitPricingChange) {
      onUnitPricingChange({ basePrice, profit: profitValue });
    }
  }, [basePrice, onUnitPricingChange]);

  const handlePaymentChange = (event) => {
    const newPaymentData = {
      ...paymentData,
      selectedPayment: event.target.value
    };
    setPaymentData(newPaymentData);
    onPaymentDataChange(newPaymentData);
  };

  const handlePayoutChange = (event) => {
    const newPaymentData = {
      ...paymentData,
      selectedPayout: event.target.value
    };
    setPaymentData(newPaymentData);
    onPaymentDataChange(newPaymentData);
  };

  const handlePriceChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setPriceEntered(Boolean(numericValue));
    setBasePrice(numericValue);
  };

  const calculateProfit = (basePrice) => {
    if (!basePrice || isNaN(basePrice)) return "0.00";
    const discount = basePrice * 0.18;
    const profitValue = (basePrice - discount).toFixed(2);
    return profitValue;
  };

  return (
    <div style={{ width: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ padding: "1rem" }}>
          <Box className="centered-container">
            <Paper
              elevation={3}
              sx={{
                width: "80%",
                padding: 2,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
              }}
            >
              <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{
                  width: "auto",
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Set your price per night!
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Including taxes, commission, and charges
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    fontSize: "2rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">{pesoSign}</Typography>
                  <TextField
                    id="base_price"
                    placeholder="566"
                    type="text"
                    value={basePrice}
                    onChange={handlePriceChange}
                    disabled={!isEditing}
                    sx={{
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                      fontSize: "inherit",
                      width: "35%",
                      input: { textAlign: "center" }
                    }}
                  />
                </Box>

                {priceEntered && (
                  <>
                    <Divider sx={{ my: 2 }}>Pricing Details</Divider>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body2">
                        Commission and charges from CebuStay totaling 18.00%
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CheckIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Enjoy instant booking confirmations for added
                          convenience.
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CheckIcon />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Let us handle guest payments, saving you time and
                          effort.
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Your total earnings would be (including taxes)
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {pesoSign}
                        {priceUnit.profit}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ padding: "1rem" }}>
          <Box
            component="form"
            autoComplete="off"
            sx={{ '& > :not(style)': { my: 1, width: "100%" } }}
          >
            <Typography variant="h6" mb={2} fontWeight="bold">
              How can your guests pay for their stay?
            </Typography>
            <RadioGroup
              aria-labelledby="Payment"
              name="Payment"
              value={paymentData.selectedPayment}
              onChange={handlePaymentChange}
            >
              <FormControlLabel
                value="Online"
                control={<Radio disabled={!isEditing} />}
                label={<Typography fontWeight="bold">Online Payment</Typography>}
              />
              <Typography sx={{ ml: 6 }}>
                CebuStay facilitates payments, allowing guests to conveniently pay the full amount online.
              </Typography>

              <FormControlLabel
                value="Flexible"
                control={<Radio disabled={!isEditing} />}
                label={<Typography fontWeight="bold">Flexible Payment</Typography>}
              />
              <Typography sx={{ ml: 6 }}>
                Pay just 50% upfront and settle the remainder conveniently in cash upon your arrival.
              </Typography>
            </RadioGroup>

            <InputLabel
              sx={{ fontSize: "1rem", width: "100%", mt: 2, fontWeight: "bold" }}
              mb={2}
            >
              How does your accommodation prefer to receive its payout?
            </InputLabel>
            <RadioGroup
              aria-labelledby="Payout"
              name="Payout"
              value={paymentData.selectedPayout}
              onChange={handlePayoutChange}
            >
              <FormControlLabel
                value="Bank"
                control={<Radio disabled={!isEditing} />}
                label={<Typography fontWeight="bold">Local Bank Transfer (Philippine Banks)</Typography>}
              />
              <Typography sx={{ ml: 6 }}>
                Opt for seamless transactions with payments deposited directly into your Philippine bank account.
              </Typography>
              <FormControlLabel
                value="Gcash"
                control={<Radio disabled={!isEditing} />}
                label={<Typography fontWeight="bold">GCash Transfer</Typography>}
              />
              <Typography sx={{ ml: 6 }}>
                Get your payments swiftly and securely deposited into your GCash account, ensuring quick access to funds.
              </Typography>
              <FormControlLabel
                value="Paypal"
                control={<Radio disabled={!isEditing} />}
                label={<Typography fontWeight="bold">Paypal Transfer</Typography>}
              />
              <Typography sx={{ ml: 6 }}>
                Opt for Paypal as your payout method for easy and efficient transactions.
              </Typography>
            </RadioGroup>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
