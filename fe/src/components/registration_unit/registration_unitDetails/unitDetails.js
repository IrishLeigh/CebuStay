import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RoomRow from './roomRow';
import TextFieldOutlineShort from '../components/textfield_short_withOutline';

export default function UnitInfo() {
  const [bedroomQuantity, setBedroomQuantity] = useState();
  const [livingRoomQuantity, setLivingRoomQuantity] = useState();
  const [kitchenQuantity, setKitchenQuantity] = useState();
  const [bathroomQuantity, setBathroomQuantity] = useState();

  const [allRooms, setAllRooms] = useState([
    { roomType: 'Bedroom', quantity: bedroomQuantity }, // Use bedroomQuantity directly
    { roomType: 'Living Room', quantity: livingRoomQuantity }, // Use livingRoomQuantity directly
    { roomType: 'Kitchen', quantity: kitchenQuantity }, // Use kitchenQuantity directly
    { roomType: 'Bathroom', quantity: bathroomQuantity }, // Use bathroomQuantity directly
  ]);

  const addRoomRow = (roomType) => {
    setAllRooms([...allRooms, { roomType, quantity: 0 }]);
  };

  const removeRoomRow = (index) => {
    const updatedRooms = [...allRooms];
    updatedRooms.splice(index, 1);
    setAllRooms(updatedRooms);
  };

  const handleRoomQuantityChange = (index, quantity) => {
    const updatedRooms = [...allRooms];
    updatedRooms[index].quantity = quantity;
    setAllRooms(updatedRooms);
  };

  console.log(allRooms);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 'auto',
          p: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 24, m: 2, mb: 4 }}>
          List of Rooms Available
        </Typography>

        {/* Render rooms */}
        {allRooms.map((room, index) => (
          <RoomRow
            key={index}
            roomName={room.roomType}
            quantity={room.quantity}
            index={index}
            onQuantityChange={handleRoomQuantityChange}
            onRemoveRoom={removeRoomRow}
            showRemoveIcon={index >= 4} // Only show remove icon for user-added rooms
          />
        ))}

        <IconButton
          aria-label="add"
          sx={{
            color: 'grey',
            '&:hover': {
              color: '#ADC939',
            },
            my: 2,
            fontSize: 16,
          }}
          onClick={() => addRoomRow('New Room')} // Change 'New Room' to the desired default room type
        >
          <AddCircleIcon /> Add Room
        </IconButton>

        <Box sx={{ mx: 2, mt: 1, mb: 4 }}>
          <Typography sx={{ mx: 1, mb: 2 }}>
            How many guests can stay?
          </Typography>
          <TextFieldOutlineShort label="Guest Capacity" />
        </Box>
      </Paper>
    </Box>
  );
}
