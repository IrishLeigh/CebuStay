import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export default function UnitPricing({ handleUnitPricing }) {
  const pesoSign = "\u20B1";
  const [priceEntered, setPriceEntered] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState({
    basePrice: "",
    profit: "",
    maxPrice: "",
  });

  const handleChange = (event) => {
    // Remove non-numeric characters
    const numericValue = event.target.value.replace(/\D/g, "");
    // Set the input value without formatting
    event.target.value = numericValue;
    // Check if the input has content
    setPriceEntered(Boolean(numericValue));
    // Set the base price state
    setBasePrice(numericValue);
  };

  const profit = () => {
    // Calculate the profit by deducting 18% from the base price
    const discount = basePrice * 0.18;
    const profitValue = (basePrice - discount).toFixed(2); // Round to 2 decimal places
    // Return the calculated profit
    return profitValue;
  };

  useEffect(() => {
    // Update the price unit whenever base price changes or on component mount
    const profitValue = profit();
    setPriceUnit({ basePrice, profit: profitValue });
  }, [basePrice]);

  // Callback function to handle save action
  const handleSave = () => {
    // Execute the handleUnitPricing callback function provided by the parent component
    handleUnitPricing(priceUnit);
    console.log("priceUnit: ", priceUnit);
  };

  return (
    <Container maxWidth="xl">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
        <Paper
          elevation={3}
          sx={{
            width: "80%",
            p: 2,
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
              p: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "24px", margin: 0 }}>
              <h1 style={{ margin: 0 }}>Set your price per night!</h1>
              <p style={{ margin: 0 }}>
                Including taxes, commission, and charges
              </p>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "74px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>{pesoSign}</div>
              <input
                id="base_price"
                placeholder={`566`}
                type="text"
                value={basePrice}
                onChange={handleChange}
                style={{
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  fontSize: "inherit",
                  width: "350px",
                }}
              />
            </div>

            {priceEntered && (
              <React.Fragment>
                <Divider>Pricing Details</Divider>
                <div style={{ justifyContent: "center", alignItems: "center" }}>
                  <Root>
                    <p>Commission and charges from CebuStay totaling 18.00%</p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <CheckIcon />
                      <p>
                        Enjoy instant booking confirmations for added
                        convenience.
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <CheckIcon />
                      <p>
                        Let us handle guest payments, saving you time and
                        effort.
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <h6>Your total earnings would be (including taxes)</h6>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "24px" }}>
                        {" "}
                        {pesoSign}
                        {priceUnit.profit}
                      </div>
                    </div>
                  </Root>
                </div>
              </React.Fragment>
            )}
          </Box>
        </Paper>
      </div>
    </Container>
  );
}
