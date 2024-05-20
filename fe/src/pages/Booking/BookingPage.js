import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Grid, Button, Box } from '@mui/material';
import BookingDetails from './BookingDetails';
import BookingGuestDetails from './BookingGuestDetails';
import './BookingPage.css';

function BookingPage() {
  const [price, setPrice] = useState();
  const [basePrice, setBasePrice] = useState(1900.24);
  const [guests, setGuests] = useState('2');
  const [lengthStay, setLengthStay] = useState(2);
  const [guestDetails, setGuestDetails] = useState(null);

  // Callback function to handle saving data and proceeding to payment
  const handleNextPayment = () => {
    console.log("Price:", price);
    console.log("Guests:", guests);
    console.log("Length of Stay:", lengthStay); 
    console.log("Guest Details:", guestDetails); // Log guest details along with other data
  };

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
  };

  const handleGuestDetailsChange = (guestDetails) => {
    setGuestDetails(guestDetails); // Update guest details state
  };

  return (
    <div>
      <AppBar position="static" sx={{background:'#16B4DD'}}>
        <Toolbar>
          <Typography variant="h6">Your Booking Details</Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} p={3}>
        <Grid item xs={12} md={4}>
          <BookingDetails 
            basePrice={basePrice}
            setBasePrice={setBasePrice}
            guests={guests}
            setGuests={setGuests}
            lengthStay={lengthStay}
            setLengthStay={setLengthStay}
            onPriceChange={handlePriceChange}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <BookingGuestDetails onGuestDetailsChange={handleGuestDetailsChange} />
          <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleNextPayment}>Next : Payment</Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default BookingPage;
