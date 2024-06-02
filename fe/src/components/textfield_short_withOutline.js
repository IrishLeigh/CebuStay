import React from 'react';
import TextField from '@mui/material/TextField';

export default function TextFieldOutlineShort(props) {
  const { width, label, value, onDaysChange } = props; // Destructure props and onDaysChange callback

  const handleDaysChange = (event) => {
    const newValue = event.target.value;
    onDaysChange(newValue); // Call the callback with the new value
  };

  return (
    <form noValidate autoComplete="off">
      <TextField
        required
        type="number"
        id="outlined-basic"
        placeholder={value}
        label={label}
        variant="outlined"
        fullWidth
        sx={{ width: `${width}px` }}
        onChange={handleDaysChange} // Call handleDaysChange when the value changes
      />
    </form>
  );
}
