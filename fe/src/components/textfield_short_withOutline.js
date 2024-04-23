import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function TextFieldOutlineShort(props) {
  const { width, label, value } = props; // Destructure width, label, and value from props

  return (
    <form noValidate autoComplete="off">
      <TextField
        required
        type="number"
        id="outlined-basic"
        placeholder={value} // Use value prop for placeholder
        label={label} // Use label prop for the TextField label
        variant="outlined"
        fullWidth // Add fullWidth prop to TextField to make it span the full width
        sx={{  width: `${width}px` }} // Set the width style for the TextField using string interpolation
      />
    </form>
  );
}
