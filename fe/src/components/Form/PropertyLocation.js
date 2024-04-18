import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography"; // Import for labels
import Container from "@mui/material/Container";

export default function AddressForm() {
  const [country, setCountry] = React.useState("");
  const [city, setCity] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");

  const cities = [
    // Replace with your actual list of cities
    { value: "Cebu", label: "Cebu" },
    { value: "New York", label: "New York" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "Chicago", label: "Chicago" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "country":
        setCountry(value);
        break;
      case "city":
        setCity(value);
        break;
      case "street":
        setStreet(value);
        break;
      case "postalCode":
        setPostalCode(value);
        break;
      default:
        break;
    }
  };

  return (
    <Container maxWidth="lg">
      <div style={{ textAlign: "center", paddingBottom: "20px" }}>
        <Typography variant="h3">Property Location</Typography>
        {/* Your lorem ipsum content */}
        <Typography variant="body1">loreeemmm ipssuummm</Typography>
      </div>
      {/* Flex container for centering the form */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column", // Added for vertical alignment
        }}
      >
        <Paper elevation={3} sx={{ p: 2, width: 400 }}>
          {/* Address form fields */}
          <TextField
            select
            label="Country"
            value={country}
            name="country"
            onChange={handleChange}
            helperText="Please select your country"
            fullWidth
            sx={{ mb: 2 }}
          >
            {/* Replace with your actual list of countries */}
            <MenuItem value="PH">Philippines</MenuItem>
            <MenuItem value="US">United States</MenuItem>
            <MenuItem value="CA">Canada</MenuItem>
            <MenuItem value="UK">United Kingdom</MenuItem>
          </TextField>
          <TextField
            select
            label="City"
            value={city}
            name="city"
            onChange={handleChange}
            helperText="Please select your city"
            fullWidth
            sx={{ mb: 2 }}
          >
            {cities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Street Address"
            value={street}
            name="street"
            onChange={handleChange}
            helperText="Enter your street address"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Postal/ZIP Code"
            value={postalCode}
            name="postalCode"
            onChange={handleChange}
            helperText="Enter your postal or ZIP code"
            fullWidth
            sx={{ mb: 2 }}
          />
        </Paper>
      </Box>
    </Container>
  );
}
