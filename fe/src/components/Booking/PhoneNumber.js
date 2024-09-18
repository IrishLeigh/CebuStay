import React, { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// List of countries with country codes and regex patterns for phone number validation
const countries = [
  { code: '+1', name: 'United States', regex: /^[0-9]{10}$/ },
  { code: '+63', name: 'Philippines', regex: /^[0-9]{10}$/ },
  { code: '+1', name: 'Canada', regex: /^[0-9]{10}$/ },
  { code: '+971', name: 'Dubai', regex: /^[0-9]{9}$/ },
  { code: '+82', name: 'Korea', regex: /^[0-9]{10,11}$/ },
  { code: '+81', name: 'Japan', regex: /^[0-9]{10,11}$/ },
  { code: '+65', name: 'Singapore', regex: /^[0-9]{8}$/ },
  { code: '+852', name: 'Hong Kong', regex: /^[0-9]{8}$/ },
  { code: '+86', name: 'China', regex: /^[0-9]{11}$/ },
];

function PhoneNumber({ phoneNumber, countryCode, onPhoneNumberChange, onCountryCodeChange }) {
  const [selectedCountry, setSelectedCountry] = useState(countryCode);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Update validity when phoneNumber or selectedCountry changes
    const country = countries.find((c) => c.code === selectedCountry);
    if (country) {
      setIsValid(country.regex.test(phoneNumber));
    }
  }, [phoneNumber, selectedCountry]);

  const handleCountryChange = (event) => {
    const code = event.target.value;
    setSelectedCountry(code);
    onCountryCodeChange(code); // Pass the selected country code to the parent component
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    onPhoneNumberChange(value);
  };

  const country = countries.find((c) => c.code === selectedCountry);

  return (
    <Box sx={{ mt: '1rem' }}>
      <FormControl style={{ width: '30%', marginRight: '1rem' }}>
        <InputLabel id="country-select-label">Country Code</InputLabel>
        <Select
          labelId="country-select-label"
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          {countries.map((country, index) => (
            <MenuItem key={index} value={country.code}>
              {country.name} 
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
          startAdornment: (
            <InputAdornment position="start">
              {selectedCountry}
            </InputAdornment>
          ),
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
