import React from 'react';
import { Modal, Box, Typography, Button, TextField, Paper, Divider } from '@mui/material';



const EditReservationModal = ({ open, handleClose, reservation }) => {
  if (!reservation) {
    return null;
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "32rem",
          bgcolor: '#16B4DD',
          p: 4,
        }}
      >
        <Paper
          sx={{
            p:4,

          }}
        >
        <Typography sx={{fontSize:'2rem', color:'#16B4DD', fontWeight:'bold'}}>
          Booking Details
        </Typography>
        <Typography sx={{fontSize:'1.125rem'}}>
         ID : #12345567
        </Typography>
        <Divider/>
        <Typography sx={{ mt: 2 }}>
          Property: {reservation.property}
        </Typography>
        {/* Add form fields to edit the reservation */}
        <TextField
          fullWidth
          label="Full Name"
          defaultValue={reservation.guestDetails.fullname}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          defaultValue={reservation.guestDetails.phonenumber}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Property"
          defaultValue={reservation.property}
          sx={{ mt: 2 }}
        />
        {/* Add other fields as needed */}
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleClose}>
          Save
        </Button>
      </Paper>
      <img src="fe/public/guestFooter.png" alt="Guest Footer" />

      </Box>
    </Modal>
  );
};

export default EditReservationModal;
