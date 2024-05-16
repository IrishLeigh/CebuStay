import * as React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid"; // Import Grid component

export default function AddressForm() {
  const [country, setCountry] = React.useState("");
  const [city, setCity] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");

  const cities = [
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
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            textAlign: "left",
          }}
        >
          Property Location
        </Typography>
        <Typography
          sx={{
            fontSize: "1.1rem",
            textAlign: "left",
            marginBottom: 2,
          }}
        >
          Fill the form
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Country"
              value={country}
              name="country"
              onChange={handleChange}
              helperText="Please select your country"
              fullWidth
            >
              <MenuItem value="PH">Philippines</MenuItem>
              <MenuItem value="US">United States</MenuItem>
              <MenuItem value="CA">Canada</MenuItem>
              <MenuItem value="UK">United Kingdom</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="City"
              value={city}
              name="city"
              onChange={handleChange}
              helperText="Please select your city"
              fullWidth
            >
              {cities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Street Address"
              value={street}
              name="street"
              onChange={handleChange}
              helperText="Enter your street address"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Postal/ZIP Code"
              value={postalCode}
              name="postalCode"
              onChange={handleChange}
              helperText="Enter your postal or ZIP code"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Button variant="contained" color="primary">
              Next
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
