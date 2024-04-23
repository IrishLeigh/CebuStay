import React from 'react';
import Box from '@mui/material/Box';
import TextFieldShort from '../components/textfield_short';
import StepperInput from '../components/textfield_spinner';
import IconButton from '@mui/material/IconButton';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


export default function RoomRow({ roomName, quantity, index, onQuantityChange, onRoomNameChange, onRemoveRoom, showRemoveIcon }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: '500px',
        mx: 2,
        mt: 2
      }}
    >
      <TextFieldShort
        placeholder="Type of Room"
        value={roomName}
        onChange={(event) => onRoomNameChange(index, event.target.value)} // Call onRoomNameChange when room name is changed
      />
      <StepperInput
        placeholder="e.g 1"
        label = "Quantity"
        value={quantity}
        onChange={(value) => onQuantityChange(index, value)}
      />
      {showRemoveIcon && (
        <IconButton
          aria-label="remove"
          onClick={() => onRemoveRoom(index)}
          sx={{
            color: 'grey',
            '&:hover': {
              color: 'red',
            },
          }}
        >
          <RemoveCircleIcon />
        </IconButton>
      )}
    </Box>
  );
}
