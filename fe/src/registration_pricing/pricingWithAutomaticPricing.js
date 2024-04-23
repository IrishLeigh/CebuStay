import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

export default function UnitPricingAuto() {
  const pesoSign = '\u20B1';

  const handleChange = (event) => {
    // Remove non-numeric characters
    const numericValue = event.target.value.replace(/\D/g, '');
    // Set the input value without formatting
    event.target.value = numericValue;
  };

  return (
    // <Container maxWidth="x1">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            p: 2,
            justifyContent: 'center',
            alignItems: 'center',
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
            <div style={{ fontSize: "18px", margin: 0 }}>
              <h1 style={{ margin: 0 }}>Set your price per night!</h1>
              <p style={{ margin: 0 }}>Including taxes, commission and charges</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "18px", marginTop: 10 }}>Base Price</p>
                <div style={{ display: "flex", fontSize: "64px", justifyContent: "center", alignItems: "center" }}>
                  <div>{pesoSign}</div>
                  <input
                    id="base_price"
                    placeholder={`566`}
                    type="text" // Change type to text
                    defaultValue="" // No initial value
                    onChange={handleChange} // Handle value changes to format input
                    style={{ border: 'none', outline: 'none', textAlign: 'left', fontSize: 'inherit', width: '350px' }}
                  />
                </div>
              </div>
              <div>
                <p>Maximum Price</p>
                <div style={{ display: "flex", fontSize: "64px", justifyContent: "center", alignItems: "center" }}>
                  <div>{pesoSign}</div>
                  <input
                    id="max_price"
                    placeholder={`99000`}
                    type="text" // Change type to text
                    defaultValue="" // No initial value
                    onChange={handleChange} // Handle value changes to format input
                    style={{ border: 'none', outline: 'none', textAlign: 'left', fontSize: 'inherit', width: '250px' }}
                  />
                </div>
              </div>
            </div>
          </Box>
        </Paper>
      </div>
    // </Container>
  );
}
