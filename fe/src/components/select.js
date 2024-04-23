import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function DynamicSelect({ label, items, value, onChange, width }) {
  const [selectedItem, setSelectedItem] = useState(value || ''); // Initialize selected item with provided value or empty string

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedItem(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ width: `${width}px` }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedItem}
          label={label}
          onChange={handleChange}
        >
          {/* Map over items array to dynamically generate MenuItem components */}
          {items.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
