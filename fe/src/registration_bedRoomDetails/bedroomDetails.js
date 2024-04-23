import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddIcon from '@mui/icons-material/Add';
import { TextField } from '@mui/material';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import RemoveIcon from '@mui/icons-material/Remove';

export default function BedroomDetails() {
  const [room, setRoom] = useState({ quantity: 0 });

  const incrementQuantity = () => {
    setRoom(prevRoom => ({ ...prevRoom, quantity: prevRoom.quantity + 1 }));
  };

  const decrementQuantity = () => {
    setRoom(prevRoom => ({ ...prevRoom, quantity: Math.max(0, prevRoom.quantity - 1) }));
  };

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
          textAlign: 'left', // Center the content horizontally
          
        }}
      >
        <div>
          {/* Title */}
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '2rem', marginBottom: '2rem' }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'left' }}>Bed Room 1</Typography>
            <Typography variant="h6" sx={{ fontSize: '1.125rem', textAlign: 'left' }}>What bed options does this room offer?</Typography>
          </div>
          
          {/* Beds */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2rem' }}>
            <SingleBedIcon />
            <Typography sx={{ fontSize: '1.125rem', mr: '4rem', ml: '2rem' }}>Single Bed</Typography>
            <IconButton onClick={incrementQuantity}>
              <AddIcon />
            </IconButton>
            <input
              type="text"
              value={room.quantity}
              // Assuming you handle the quantity change elsewhere
              style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center', alignItems:"center" , justifyContent:'center'}}
            />
            <IconButton onClick={decrementQuantity}>
              <RemoveIcon />
            </IconButton>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2rem' }}>
            <SingleBedIcon />
            <Typography sx={{ fontSize: '1.125rem', mr: '4rem', ml: '2rem' }}>Double Bed</Typography>
            <IconButton onClick={incrementQuantity}>
              <AddIcon />
            </IconButton>
            <input
              type="text"
              value={room.quantity}
              // Assuming you handle the quantity change elsewhere
              style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center', alignItems:"center" , justifyContent:'center'}}
            />
            <IconButton onClick={decrementQuantity}>
              <RemoveIcon />
            </IconButton>
          </div>
        </div>
      </Paper>
    </Box>
  );
}
