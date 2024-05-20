import React, { useState } from 'react';
import { Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// List of countries with country codes and regex patterns for phone number validation
const countries = [
  { code: '+1', name: 'United States', regex: /^[0-9]{10}$/ },
  { code: '+63', name: 'Philippines', regex: /^[0-9]{11}$/ },
  { code: '+1', name: 'Canada', regex: /^[0-9]{10}$/ },
  { code: '+971', name: 'Dubai', regex: /^[0-9]{9}$/ },
  { code: '+82', name: 'Korea', regex: /^[0-9]{10,11}$/ },
  { code: '+81', name: 'Japan', regex: /^[0-9]{10,11}$/ },
  { code: '+65', name: 'Singapore', regex: /^[0-9]{8}$/ },
  { code: '+852', name: 'Hong Kong', regex: /^[0-9]{8}$/ },
  { code: '+86', name: 'China', regex: /^[0-9]{11}$/ },
];

function PhoneNumber({ phoneNumber, countryCode, onPhoneNumberChange, onCountryCodeChange }) {
  const [country, setCountry] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    onCountryCodeChange(selectedCountry);
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    onPhoneNumberChange(value);
    const selectedCountry = countries.find((c) => c.code === country); // Use the currently selected country
    if (selectedCountry) {
      setIsValid(selectedCountry.regex.test(value));
    }
  };
  

  return (
    <Box sx={{ mt: '1rem' }}>
      <FormControl style={{ width: '30%', marginRight: '1rem' }}>
        <InputLabel id="country-select-label">Country Code</InputLabel>
        <Select
          labelId="country-select-label"
          id="country-select"
          value={country}
          onChange={handleCountryChange}
        >
          {countries.map((country, index) => (
            <MenuItem key={index} value={country.code}>
              {`${country.name} ${country.code}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Phone Number"
        variant="outlined"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        InputProps={{
          endAdornment: phoneNumber && isValid ? (
            <InputAdornment position="end">
              <CheckIcon color="success" />
            </InputAdornment>
          ) : null,
        }}
        error={phoneNumber && !isValid}
        helperText={phoneNumber && !isValid ? "Invalid phone number" : ""}
      />
    </Box>
  );
}

export default PhoneNumber;
