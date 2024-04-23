import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function TextFieldShort(props) {
  const handleChange = (event) => {
    // Call the onChange prop with the updated value
    if (props.onChange) {
      props.onChange(event); // Pass the entire event object instead of just the value
    }
  };

  return (
    <form noValidate autoComplete="off">
      <TextField
        required
        id="outlined-required"
        value={props.value}
        label={props.name}
        placeholder={props.placeholder}
        fullWidth
        sx={{ 
          width: '210px',
          mr: 1
        }}
        onChange={handleChange}
      />
    </form>
  );
}
