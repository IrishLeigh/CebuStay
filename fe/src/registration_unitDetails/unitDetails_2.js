import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddIcon from '@mui/icons-material/Add';
import { TextField } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import CancelIcon from '@mui/icons-material/Cancel';

export default function UnitInfo_2() {
  const [UnitDetailsData, setUnitDetailsData] = useState({
    roomDetails: [
      // Predefined rooms and their quantities
      { roomType: 'Bedroom', quantity: 0 },
      { roomType: 'Bathroom', quantity: 0 },
      { roomType: 'Living Room', quantity: 0 },
      { roomType: 'Kitchen', quantity: 0 },
    ],
    guestCapacity: ''
  });

  const addRoom = () => {
    // Add a new room with default values
    setUnitDetailsData(prevData => ({
      ...prevData,
      roomDetails: [...prevData.roomDetails, { roomType: '', quantity: 0 }]
    }));
  };

  const handleRoomTypeChange = (index, value) => {
    setUnitDetailsData(prevData => {
      const updatedRoomDetails = [...prevData.roomDetails];
      updatedRoomDetails[index].roomType = value;
      return { ...prevData, roomDetails: updatedRoomDetails };
    });
  };

  const handleQuantityChange = (index, value) => {
    setUnitDetailsData(prevData => {
      const updatedRoomDetails = [...prevData.roomDetails];
      updatedRoomDetails[index].quantity = value;
      return { ...prevData, roomDetails: updatedRoomDetails };
    });
  };

  const removeRoom = (index) => {
    setUnitDetailsData(prevData => {
      const updatedRoomDetails = [...prevData.roomDetails];
      updatedRoomDetails.splice(index, 1);
      return { ...prevData, roomDetails: updatedRoomDetails };
    });
  };

  const incrementQuantity = (index) => {
    setUnitDetailsData(prevData => {
      const updatedRoomDetails = [...prevData.roomDetails];
      updatedRoomDetails[index].quantity += 1;
      return { ...prevData, roomDetails: updatedRoomDetails };
    });
  };

  const decrementQuantity = (index) => {
    setUnitDetailsData(prevData => {
      const updatedRoomDetails = [...prevData.roomDetails];
      if (updatedRoomDetails[index].quantity > 0) {
        updatedRoomDetails[index].quantity -= 1;
      }
      return { ...prevData, roomDetails: updatedRoomDetails };
    });
  };

  console.log(UnitDetailsData);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Changed height to minHeight for responsiveness
        padding: '1rem', // Added padding for mobile screens
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%', // Set width to 100% for responsiveness
          maxWidth: '32rem', // Added maxWidth for larger screens
          padding: '1rem', // Added padding for better spacing
          textAlign: 'center', // Center the content horizontally
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1.125rem', m:'2rem', textAlign:'left' }}> {/* Increased font size for better readability */}
          List of Rooms Available
        </Typography>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {UnitDetailsData.roomDetails.map((room, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <TextField
                type="text"
                value={room.roomType}
                onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                placeholder="Room Type"
                style={{ width: '8rem', marginRight: '1rem' }}
              />
              <IconButton onClick={() => incrementQuantity(index)}>
                <AddIcon />
              </IconButton>
              <TextField
                type="text"
                value={room.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center', alignItems:"center" , justifyContent:'center'}}
              />
              <IconButton onClick={() => decrementQuantity(index)}>
                <RemoveIcon />
              </IconButton>
              <IconButton onClick={() => removeRoom(index)}>
                <CancelIcon sx= {{color: '#EE414B'}} />
              </IconButton>
            </Box>
          ))}
          <IconButton
            aria-label="add"
            onClick={addRoom}
            sx={{
              color: 'grey',
              '&:hover': {
                color: '#ADC939',
              },
              fontSize: '1rem',
              marginRight: 'auto', // Push button to the right
              display: 'block',
              marginLeft:'5.5rem',
               // Ensure button is displayed as a block element
            }}
          >
            <AddCircleIcon  /> Add Room
          </IconButton>
        </div>
        <Box sx={{ mt: '1rem' }}>
          <Typography variant="h6" sx={{ fontSize: '1.125rem', m:'2rem', textAlign:'left' ,alignItems:'left', justifyContent:'left'}}> {/* Increased font size for better readability */}
            How many guests can stay?
          </Typography>
          <TextField
            label="Guest Capacity"
            value={UnitDetailsData.guestCapacity}
            onChange={(e) => setUnitDetailsData({...UnitDetailsData, guestCapacity: e.target.value})}
            style={{ width: 'auto' , marginLeft: '1rem', marginBottom:'2rem',justifyContent:'left'}} // Set width to 100% for responsiveness
          />
        </Box>
      </Paper>
    </Box>
  );
}
