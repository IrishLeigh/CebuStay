import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function FormPropsTextFields(props) {
  const handleChange = (event) => {
    // Call the onChange callback function passed from the parent component
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  return (
    <form noValidate autoComplete="off">
      <TextField
        required
        id="outlined-required"
        value={props.value} // Pass the value directly to the TextField's value prop
        label={props.name}
        sx={{ width: props.width }}
        onChange={handleChange} // Pass the handleChange function to handle value changes
      />
    </form>
  );
}
