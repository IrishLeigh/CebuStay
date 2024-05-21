import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";

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

export default function UnitPricing({ handleUnitPricing }) {
  const pesoSign = "\u20B1";
  const [priceEntered, setPriceEntered] = useState(false);
  const [basePrice, setBasePrice] = useState(() => {
    const savedBasePrice = localStorage.getItem('basePrice');
    return savedBasePrice ? savedBasePrice : "";
  });
  const [priceUnit, setPriceUnit] = useState({
    basePrice: basePrice,
    profit: "",
  });

  const handleChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    event.target.value = numericValue;
    setPriceEntered(Boolean(numericValue));
    setBasePrice(numericValue);
  };

  const calculateProfit = (basePrice) => {
    const discount = basePrice * 0.18;
    const profitValue = (basePrice - discount).toFixed(2);
    return profitValue;
  };

  useEffect(() => {
    const profitValue = calculateProfit(basePrice);
    setPriceUnit({ basePrice, profit: profitValue });
  }, [basePrice]);

  useEffect(() => {
    localStorage.setItem('basePrice', basePrice);
    handleUnitPricing(priceUnit);
  }, [priceUnit, basePrice, handleUnitPricing]);

  return (
    <Container maxWidth="xl">
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          mt: 12,
          mb: 12
        }}
      >
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
      </Box>
    </Container>
  );
}
