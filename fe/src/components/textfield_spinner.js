import React from 'react';
import TextField from '@mui/material/TextField';

export default function StepperInput({ value, onChange, placeholder, label }) {
  const handleChange = (e) => {
    const inputValue = parseInt(e.target.value);
    onChange(Math.max(0, isNaN(inputValue) ? 0 : inputValue));
  };

  return (
    <TextField
      sx={{
        width: "210px",
      }}
      type="number"
      placeholder={placeholder}
      variant="outlined"
      label={label} // Added label prop
      value={value}
      onChange={handleChange}
    />
  );
}
