import React, { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// List of countries with country codes and regex patterns for phone number validation
const countries = [
  { code: '+1', name: 'Anguilla', regex: /^[0-9]{7}$/ },
  { code: '+1', name: 'Antigua and Barbuda', regex: /^[0-9]{7}$/ },
  { code: '+55', name: 'Argentina', regex: /^[0-9]{11}$/ },
  { code: '+54', name: 'Argentina', regex: /^[0-9]{10}$/ },
  { code: '+1', name: 'Bahamas', regex: /^[0-9]{7}$/ },
  { code: '+1', name: 'Barbados', regex: /^[0-9]{7}$/ },
  { code: '+1', name: 'Belize', regex: /^[0-9]{7}$/ },
  { code: '+267', name: 'Botswana', regex: /^[0-9]{8}$/ },
  { code: '+55', name: 'Brazil', regex: /^[0-9]{11}$/ },
  { code: '+1', name: 'British Virgin Islands', regex: /^[0-9]{7}$/ },
  { code: '+1', name: 'Bermuda', regex: /^[0-9]{7}$/ },
  { code: '+1', name: 'Cayman Islands', regex: /^[0-9]{7}$/ },
  { code: '+56', name: 'Chile', regex: /^[0-9]{9}$/ },
  { code: '+53', name: 'Cuba', regex: /^[0-9]{8}$/ },
  { code: '+1', name: 'Cuba', regex: /^[0-9]{8}$/ },
  { code: '+86', name: 'China', regex: /^[0-9]{11}$/ },
  { code: '+1', name: 'Dominican Republic', regex: /^[0-9]{10}$/ },
  { code: '+593', name: 'Ecuador', regex: /^[0-9]{9}$/ },
  { code: '+20', name: 'Egypt', regex: /^[0-9]{10}$/ },
  { code: '+33', name: 'France', regex: /^[0-9]{9}$/ },
  { code: '+1', name: 'Grenada', regex: /^[0-9]{7}$/ },
  { code: '+504', name: 'Honduras', regex: /^[0-9]{8}$/ },
  { code: '+852', name: 'Hong Kong', regex: /^[0-9]{8}$/ },
  { code: '+62', name: 'Indonesia', regex: /^[0-9]{10,12}$/ },
  { code: '+98', name: 'Iran', regex: /^[0-9]{10}$/ },
  { code: '+964', name: 'Iraq', regex: /^[0-9]{10}$/ },
  { code: '+972', name: 'Israel', regex: /^[0-9]{9}$/ },
  { code: '+97', name: 'Israel', regex: /^[0-9]{9}$/ },
  { code: '+39', name: 'Italy', regex: /^[0-9]{10}$/ },
  { code: '+81', name: 'Japan', regex: /^[0-9]{10,11}$/ },
  { code: '+254', name: 'Kenya', regex: /^[0-9]{10}$/ },
  { code: '+1', name: 'Jamaica', regex: /^[0-9]{10}$/ },
  { code: '+976', name: 'Mongolia', regex: /^[0-9]{8}$/ },
  { code: '+52', name: 'Mexico', regex: /^[0-9]{10}$/ },
  { code: '+60', name: 'Malaysia', regex: /^[0-9]{9}$/ },
  { code: '+91', name: 'India', regex: /^[0-9]{10}$/ },
  { code: '+49', name: 'Germany', regex: /^[0-9]{10}$/ },
  { code: '+1', name: 'Saint Lucia', regex: /^[0-9]{7}$/ },
  { code: '+1', name: 'Saint Vincent and the Grenadines', regex: /^[0-9]{7}$/ },
  { code: '+1', name: 'Saint Kitts and Nevis', regex: /^[0-9]{7}$/ },
  { code: '+1', name: 'Trinidad and Tobago', regex: /^[0-9]{10}$/ },
  { code: '+44', name: 'United Kingdom', regex: /^[0-9]{10}$/ },
  { code: '+1', name: 'United States', regex: /^[0-9]{10}$/ },
  { code: '+971', name: 'United Arab Emirates', regex: /^[0-9]{9}$/ },
  { code: '+380', name: 'Ukraine', regex: /^[0-9]{9}$/ },
  { code: '+92', name: 'Pakistan', regex: /^[0-9]{10}$/ },
  { code: '+63', name: 'Philippines', regex: /^[0-9]{10}$/ },
  { code: '+34', name: 'Spain', regex: /^[0-9]{9}$/ },
  { code: '+41', name: 'Switzerland', regex: /^[0-9]{9}$/ },
  { code: '+46', name: 'Sweden', regex: /^[0-9]{10}$/ },
  { code: '+963', name: 'Syria', regex: /^[0-9]{9}$/ },
  { code: '+216', name: 'Tunisia', regex: /^[0-9]{8}$/ },
  { code: '+380', name: 'Ukraine', regex: /^[0-9]{9}$/ },
  { code: '+254', name: 'Kenya', regex: /^[0-9]{10}$/ }
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
        <InputLabel id="country-select-label" style={{backgroundColor:'white'}}>Country Code</InputLabel>
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
