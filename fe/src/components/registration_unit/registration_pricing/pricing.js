import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

export default function UnitPricing() {
  const pesoSign = '\u20B1';
  const [priceEntered, setPriceEntered] = React.useState(false);
  const [basePrice, setBasePrice] = React.useState('');

  const handleChange = (event) => {
    // Remove non-numeric characters
    const numericValue = event.target.value.replace(/\D/g, '');
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
  


  return (
    <Container maxWidth="x1">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper
          elevation={3}
          sx={{
            width: '80%',
            p: 2,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '5px'
          }}
        >
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              width: 'auto',
              p: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: "24px", margin: 0 }}>
              <h1 style={{ margin: 0 }}>Set your price per night!</h1>
              <p style={{ margin: 0 }}>Including taxes, commission, and charges</p>
            </div>

            {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p>Base Price</p>
            </div> */}
            <div style={{ display: "flex", fontSize: "74px", justifyContent: "center", alignItems: "center" }}>
              <div>{pesoSign}</div>
              <input
                id="base_price"
                placeholder={`566`}
                type="text"
                value={basePrice}
                onChange={handleChange}
                style={{ border: 'none', outline: 'none', textAlign: 'center', fontSize: 'inherit', width: '350px' }}
              />
            </div>
            
            {priceEntered && (
              <React.Fragment>
                <Divider>Pricing Details</Divider>
                <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Root>
                    <p>Commission and charges from CebuStay totaling 18.00%</p>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <CheckIcon />
                      <p>Enjoy instant booking confirmations for added convenience.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <CheckIcon />
                      <p>Let us handle guest payments, saving you time and effort.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <h6>Your total earnings would be (including taxes)</h6>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '24px' }}>{pesoSign} {profit()}</div>
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
