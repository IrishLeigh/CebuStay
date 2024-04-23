import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function FormPropsTextFields(props) {
  return (
    <form noValidate autoComplete="off">
      <TextField
        required
        id="outlined-required"
        placeholder={props.value}
        label={props.name}
        sx = {{width:props.width}}
        // Add fullWdth prop to TextField to make it span the full width
         // Set the width style for the TextField
      />
    </form>
  );
}
