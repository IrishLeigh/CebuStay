import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Paper, Divider, Stack, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import CheckIcon from '@mui/icons-material/Check';

const UserDetails = ({ open, handleClose, reservation }) => {

  const [special, setSpecial] = useState("so here it is, hehehehe");

  const getDateParts = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    return { day, month };
  };

  // useEffect(() => {
  //   const fetchReservation = async () => {
  //     try {
  //       const response = await fetch(`/api/reservations/${reservationId}`);
  //       const data = await response.json();
  //       setReservation(data);
  //     } catch (error) {
  //       console.error('Error fetching reservation:', error);
  //     }
  //   };

  //   if (open && reservationId) {
  //     fetchReservation();
  //   }
  // }, [open, reservationId]);

  // const checkInParts = getDateParts(checkIn);

  if (!reservation) {
    return null;
  }

  const handleCheckIn = () => {
    console.log("Checked-in");
  };

  const handleCheckOut = () => {
    console.log("Checked-out");
  };

  const { checkIn, checkOut } = reservation;

  const checkInParts = getDateParts(checkIn);
console.log('chicken',reservation)
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '55rem',
          maxHeight: '80vh', // Maximum height
          overflowY: 'auto', // Enable vertical scrolling
          bgcolor: '#16B4DD',
          boxShadow: 24,
          p: 4,
        }}
      >
        <img src="/guestHeader.png" alt="Guest Header" style={{ width: '100.025%', marginBottom: '-0.5rem' }} />
        <Paper sx={{ p: 4 }}>
          <Typography sx={{ fontSize: '2rem', color: '#16B4DD', fontWeight: 'bold' }}>
            Booking Details
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 1,
              m: 1
            }}
          >
            <Stack direction="column">
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
               {reservation.name}
              </Typography>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
               {reservation.location}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckIcon sx={{ fontSize: '1.125rem', mr: 1 }} />
                <Typography sx={{ fontSize: '1.125rem' }}>{reservation.type}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckIcon sx={{ fontSize: '1.125rem', mr: 1 }} />
                <Typography sx={{ fontSize: '1.125rem' }}>Whole Place</Typography>
              </Box>
            </Stack>
            <Paper
              sx={{
                height: 'auto',
                width: '10rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                p: 1,
                borderRadius: '8px',
                boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.5)'
              }}
            >
             <Typography sx={{ fontSize: "2.5rem", color: '#A334CF', fontWeight: 'bold' }}>
                {checkInParts.day}
              </Typography>
              <Typography sx={{ fontSize: "1.5rem", color: '#A334CF', fontWeight: 'bold' }}>
                {checkInParts.month}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                <KeyIcon sx={{ fontSize: '1rem', mr: 1 }} />
                <Typography sx={{ fontSize: "0.9rem" }}>{checkIn}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                <KeyOffIcon sx={{ fontSize: '1rem', mr: 1 }} />
                <Typography sx={{ fontSize: "0.9rem" }}>{checkOut}</Typography>
              </Box>
              <Divider sx={{ width: '80%', my: 1 }} />
              <Typography sx={{ fontSize: "1rem", color: 'grey', mb: 0.5 }}>
                Booking ID:
              </Typography>
              <Typography sx={{ fontSize: "1.125rem", fontWeight: 'bold' }}>
              {reservation.id}
              </Typography>
            </Paper>
          </Box>
          <Divider />

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ color: 'black'}}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' ,  color: 'black', width:'8rem', textAlign:'center'}}>Number of Guests</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' ,  color: 'black', textAlign:'center'}}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' ,  color: 'black', textAlign:'center'}}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold',  color: 'black', textAlign:'center' }}>Property Type</TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell style={{fontWeight:'bold', color:'black', textAlign:'center'}}>{reservation.guests}</TableCell>
                    <TableCell  style={{fontWeight:'bold', color:'black', textAlign:'center'}}>{reservation.amount}</TableCell>
                    <TableCell  style={{fontWeight:'bold', color:'black', width:'8rem', textAlign:'center', color: reservation.status === 'Checked-in' ? 'blue' : reservation.status === 'Cancelled' ? 'red' : reservation.status === 'Checked-out' ? 'green' : 'black'}}>{reservation.status}</TableCell>
                    <TableCell  style={{fontWeight:'bold', color:'black', textAlign:'center'}}>{reservation.type}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{reservation.numberOfGuests}</TableCell>
                  <TableCell>{reservation.nights}</TableCell>
                  <TableCell>{reservation.price}</TableCell>
                  <TableCell>{reservation.payment}</TableCell>
                  {/* <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Checked-in" variant="outlined" sx={{ backgroundColor: '#4CAF50', color: '#FFFFFF', borderColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' }}} onClick={handleCheckIn} />
                      <Chip label="Checked-out" variant="outlined" sx={{ backgroundColor: '#F44336', color: '#FFFFFF', borderColor: '#F44336', '&:hover': { backgroundColor: '#D32F2F' }}} onClick={handleCheckOut} />
                    </Stack>
                  </TableCell> */}
                  <TableCell>
                    {/* Add any additional actions here */}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>


        
          <Typography sx={{ mt: 2, fontSize: '1.25rem', fontWeight: 'bold' }}>
            Booker
          </Typography>
          {/* Add form fields to edit the reservation */}
          <TextField
            fullWidth
            label={`${reservation.first_name} ${reservation.last_name}`}
            defaultValue={`${reservation.first_name} ${reservation.last_name}`}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            defaultValue="sanjuanirishleigh09@gmail.com"
            sx={{ mt: 2 }}
          />
         <TextField
    fullWidth
    label={reservation.phone}
    defaultValue={reservation.booker ? reservation.booker.phonenum : ''}
    sx={{ mt: 2 }}
/>

          <TextField
            fullWidth
            label="Country"
            defaultValue="Philippines"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            label="Special Instructions"
            value={special}
            sx={{ mt: 2 }}
            onChange={(e) => setSpecial(e.target.value)}
          />
          {/* <Button variant="contained" sx={{ mt: 2 }} onClick={handleClose}>
            Save
          </Button> */}
        </Paper>
        <img src="/guestFooter.png" alt="Guest Footer" style={{ width: '100.92%', marginTop: '-0.5rem', marginLeft: '-0.25rem'  }} />
      </Box>
    </Modal>
  );
};

export default UserDetails;