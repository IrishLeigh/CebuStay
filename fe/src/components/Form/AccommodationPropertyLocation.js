import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button"; // Import Button component
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
    <Container
      maxWidth="lg"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "left" }}>
          Property Location
        </Typography>
        <Typography sx={{ fontSize: 18, mb: 2, textAlign: "left" }}>
          Fill the form
        </Typography>
        <Paper elevation={3} sx={{ p: 2, width: 400 }}>
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
          <Box textAlign="center">
            {" "}
            {/* Center the button */}
            <Button variant="contained" color="primary">
              Next
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
