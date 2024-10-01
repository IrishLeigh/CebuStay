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
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import TemplateFrameEdit from "./TemplateFrame";
import LoadingModal from "../modal/LoadingModal";
export default function PricePayment({
  propertyid,
  parentUnitPricing = {},
  parentPaymentData = {},
  isSingleUnit,
  onPricingChange,
  onPaymentChange,
  onSaveStatusChange
}) {
  const pesoSign = "\u20B1";
  const [priceEntered, setPriceEntered] = useState(false);
  const [basePrice, setBasePrice] = useState(parentUnitPricing.min_price || "");
  const [priceUnit, setPriceUnit] = useState({
    basePrice: parentUnitPricing.min_price || "",
    profit: "",
  });
  const [paymentData, setPaymentData] = useState({
    selectedPayment: parentPaymentData.isonline === 1 ? "Online" : "",
    selectedPayout: parentPaymentData.paymentmethod || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    console.log("ON MOUNT");
    console.log("PRICING", parentUnitPricing);
    console.log("PAYMENT", parentPaymentData);
  }, []);
  useEffect(() => {
    // Update state when parent data changes
    setBasePrice(parentUnitPricing.min_price || "");
    setPaymentData({
      selectedPayment: parentPaymentData.isonline === 1 ? "Online" : "Flexible",
      selectedPayout: parentPaymentData.paymentmethod || "",
    });
    setOriginalData({
      basePrice: parentUnitPricing.min_price || "",
      paymentData: {
        selectedPayment:
          parentPaymentData.isonline === 1 ? "Online" : "Flexible",
        selectedPayout: parentPaymentData.paymentmethod || "",
      },
    });
  }, [parentUnitPricing, parentPaymentData]);

  useEffect(() => {
    const profitValue = calculateProfit(Number(basePrice));
    setPriceUnit({ basePrice, profit: profitValue });
  }, [basePrice]);

  const handlePaymentChange = (event) => {
    setPaymentData((prevState) => ({
      ...prevState,
      selectedPayment: event.target.value,
    }));
    setHasChanges(true);
  };

  const handlePayoutChange = (event) => {
    setPaymentData((prevState) => ({
      ...prevState,
      selectedPayout: event.target.value,
    }));
    setHasChanges(true);
  };

  const handlePriceChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setPriceEntered(Boolean(numericValue));
    setBasePrice(numericValue);
    setHasChanges(true);
  };

  const calculateProfit = (basePrice) => {
    if (!basePrice || isNaN(basePrice)) return "0.00";
    const discount = basePrice * 0.18;
    const profitValue = (basePrice - discount).toFixed(2);
    return profitValue;
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirmDiscard) {
        return; // Exit the function if the user cancels the discard action
      }
    }

    setIsEditing(false);
    setBasePrice(originalData.basePrice);
    setPaymentData(originalData.paymentData);
  };
  
  const handleEditingChange = (editing) => {
    if (editing === true) {
      setIsEditing(editing);
    }else if (editing === false) {
      handleCancel();
      
    }
   
    console.log(`Editing mode changed: ${editing}`); // Log or use this state as needed
  };

  const handleSave = async () => {
    setIsLoading(true);
    setIsEditing(false);
    // Gather the data to be sent to the API
    const dataToSave = {
      unitPricing: {
        min_price: basePrice,
      },
      paymentData: {
        isonline: paymentData.selectedPayment === "Online" ? 1 : 0,
        paymentmethod: paymentData.selectedPayout,
      },
    };
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/updatepropertypricingpayment-single/${propertyid}`,
        {
          unitPricing: dataToSave.unitPricing,
          paymentData: dataToSave.paymentData,
        }
      );
      if (res.data) {
        console.log("Data saved successfully:", res.data);
        if (res.data.status === "success") {
          onPricingChange(res.data.updatedPricing);
          setBasePrice(res.data.updatedPricing.min_price);
          onPaymentChange(res.data.updatedPayment);
          setPaymentData({
            selectedPayment:
              res.data.updatedPayment.isonline === 1 ? "Online" : "Flexible",
            selectedPayout: res.data.updatedPayment.paymentmethod,
          });
          // parentUnitPricing.min_price = res.data.updatedPricing.min_price;
          setIsSaved(true);
          setIsEditing(false);
          setOpenSnackbar(true);
          onSaveStatusChange('Saved');
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("Error saving data:", error);
    }
    console.log("Saving data:", dataToSave);

  };
  const handleCloseSnackbar  = () => {
    setOpenSnackbar(false);
  }
  return (
    <>
      <TemplateFrameEdit onEditChange={handleEditingChange}  saved ={isSaved}  onSave={handleSave} hasChanges={hasChanges}  cancel={handleCancel}/>
      <Paper
        style={{
          width: "auto",
          padding: "4rem",
          borderRadius: "0.8rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "1.125rem",
              fontWeight: "bold",
            }}
          >
            Your Unit Pricing and Payment Details
          </Typography>
          {/* <div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                sx={{ marginRight: "1rem" }}
              >
                Edit
              </Button>
            )}
            {isEditing && (
              <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
                Cancel
              </Button>
            )}
          </div> */}
        </div>
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          Set your unit's nightly price, including taxes and fees. Choose how
          guests can pay and how you prefer to receive payouts. Click "Edit" to
          make changes, then save or cancel as needed.
        </Typography>

        <Grid container spacing={2}>
          {isSingleUnit && (
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
                          input: { textAlign: "center" },
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
          )}

          <Grid item xs={12} md={6} sx={{ padding: "1rem" }}>
            <Box
              component="form"
              autoComplete="off"
              sx={{ "& > :not(style)": { my: 1, width: "100%" } }}
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
                  label={
                    <Typography fontWeight="bold">Online Payment</Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  CebuStay facilitates payments, allowing guests to conveniently
                  pay the full amount online.
                </Typography>

                <FormControlLabel
                  value="Flexible"
                  control={<Radio disabled={!isEditing} />}
                  label={
                    <Typography fontWeight="bold">Flexible Payment</Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  Pay just 50% upfront and settle the remainder conveniently in
                  cash upon your arrival.
                </Typography>
              </RadioGroup>

              <InputLabel
                sx={{
                  fontSize: "1rem",
                  width: "100%",
                  mt: 2,
                  fontWeight: "bold",
                }}
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
                  label={
                    <Typography fontWeight="bold">
                      Local Bank Transfer (Philippine Banks)
                    </Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  Opt for seamless transactions with payments deposited directly
                  into your Philippine bank account.
                </Typography>
                <FormControlLabel
                  value="Gcash"
                  control={<Radio disabled={!isEditing} />}
                  label={
                    <Typography fontWeight="bold">GCash Transfer</Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  Get your payments swiftly and securely deposited into your GCash
                  account, ensuring quick access to funds.
                </Typography>
                <FormControlLabel
                  value="Paypal"
                  control={<Radio disabled={!isEditing} />}
                  label={
                    <Typography fontWeight="bold">Paypal Transfer</Typography>
                  }
                />
                <Typography sx={{ ml: 6 }}>
                  Opt for Paypal as your payout method for easy and efficient
                  transactions.
                </Typography>
              </RadioGroup>
            </Box>
            {isEditing && (
              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
                  Revert Changes
                </Button>
                <Button
                  variant="contained"
                  disabled={!hasChanges}
                  onClick={handleSave}
                >
                  Save All Changes
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
            Basic Info saved successfully!
            </Alert>
          </Snackbar>
      </Paper>
      <LoadingModal open={isLoading} />
    </>
  );
}
