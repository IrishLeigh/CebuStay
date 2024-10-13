import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Grid, Typography, useMediaQuery } from "@mui/material";

// Styled component for layout
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > :not(style) ~ :not(style)": {
    margin: 0,
  },
}));

export default function UnitPricingPerMonth({ onUnitPricingChange, parentUnitPricing, handleNext, handleBack }) {
  const pesoSign = "\u20B1"; // Peso symbol
  const [priceEntered, setPriceEntered] = useState(false);
  const [basePrice, setBasePrice] = useState(parentUnitPricing?.basePrice || ""); // Get base price from parent
  const [priceUnit, setPriceUnit] = useState({
    basePrice: basePrice,
    profit: "",
  });
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // Handle input change for price
  const handleChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, ""); // Keep only numeric values
    event.target.value = numericValue; // Update input value
    setPriceEntered(Boolean(numericValue)); // Update priceEntered state
    setBasePrice(numericValue); // Set base price
  };

  // Calculate profit after discount
  const calculateProfit = (basePrice) => {
    const discount = basePrice * 0.18; // 18% discount
    const profitValue = (basePrice - discount).toFixed(2); // Calculate profit
    return profitValue;
  };

  // Update profit whenever basePrice changes
  useEffect(() => {
    const profitValue = calculateProfit(basePrice);
    setPriceUnit({ basePrice, profit: profitValue });
  }, [basePrice]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Validate price and proceed to next step
  const validateAndProceed = () => {
    const minPrice = 566; // Minimum price limit
    if (basePrice < minPrice) {
      alert(`Please enter a price of at least ${pesoSign}${minPrice} to sustain the platform's operational integrity.`);
    } else if (basePrice) {
      onUnitPricingChange(priceUnit); // Update parent with pricing info
      handleNext(); // Move to next step
    } else {
      alert("Please enter a valid price.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box className="centered-container">
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            padding: "2rem",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "0.8rem",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box
                component="form"
                autoComplete="off"
                sx={{
                  width: "auto",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "2rem", marginBottom: "1rem", fontWeight: "bold" }}>Set your price per month!</p>
                  <p style={{ fontSize: "1rem", margin: 0 }}>
                    Including taxes, commission, and charges
                  </p>
                </div>

                <div style={{ display: "flex", fontSize: "74px", justifyContent: "center", alignItems: "center" }}>
                  <div>{pesoSign}</div>
                  <input
                    id="base_price"
                    placeholder={`566`}
                    type="text"
                    value={basePrice}
                    onChange={handleChange}
                    required
                    style={{
                      border: "none",
                      outline: "none",
                      textAlign: "center",
                      fontSize: "inherit",
                      width: isMobile ? "150px" : "350px",
                    }}
                  />
                </div>

                <React.Fragment>
                  <Divider>Pricing Details</Divider>
                  <div style={{ justifyContent: "center", alignItems: "center" }}>
                    <Root>
                      <p style={{ textAlign: "center" }}>
                        Commission and charges from CebuStay totaling 18.00% <br />
                        This amount also covers all taxes and fees. Please set your price to maximize your profit!
                      </p>
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <CheckIcon />
                        <p>Enjoy instant booking confirmations for added convenience.</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <CheckIcon />
                        <p>Let us handle guest payments, saving you time and effort.</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <h6>Your total earnings would be (including taxes)</h6>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        {priceEntered && (
                          <div style={{ fontWeight: "bold", fontSize: "24px" }}>
                            {pesoSign}
                            {priceUnit.profit}
                          </div>
                        )}
                      </div>
                    </Root>
                  </div>
                </React.Fragment>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "0.8rem",
                  padding: "1rem",
                  color: "#2A2A2E"
                }}
              >
                <Typography variant="h6" mb={2} gutterBottom>
                  Important Information for Setting Price
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocalOfferIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Our platform adds a **one-month security deposit** for guests when booking on monthly terms.
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <AttachMoneyIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    A **one-month advance payment** will also be collected upfront.
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarMonthIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    For the remaining months, we will collect payments **monthly**.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button onClick={validateAndProceed} className="stepperNext">
          Next
        </Button>
      </div>
    </Container>
  );
}
