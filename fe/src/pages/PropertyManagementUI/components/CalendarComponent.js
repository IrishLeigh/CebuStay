import React, { useState, useEffect } from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '500px',
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  mb: 2,
};

const contentStyle = {
  width: '100%',
  mt: 2,
};

const fieldStyle = {
  mt: 2,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
};

export default function CalendarComponent({ propertyTypes }) {
  const [open, setOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState({ title: '', description: '', start: '', end: '' });
  const [calendarHeight, setCalendarHeight] = useState('auto');
  const [marginLeft, setMarginLeft] = useState('auto');

  useEffect(() => {
    const updateCalendarHeight = () => {
      if (window.innerWidth <= 600) {
        setCalendarHeight('auto');
      } else {
        setCalendarHeight('100%');
      }

      if (window.innerWidth < 1650) {
        setMarginLeft('10rem'); // Adjust this value as needed
      } else {
        setMarginLeft('0px');
      }
    };
    window.addEventListener('resize', updateCalendarHeight);
    updateCalendarHeight();
    return () => window.removeEventListener('resize', updateCalendarHeight);
  }, []);

  const handleOpen = (info) => {
    setEventInfo(info.event);
    const propertyDetails = propertyTypes.find(property => property.bookingid == info.event.title);
    setEventInfo(propertyDetails);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const formatEventDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

  const addOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const events = propertyTypes.length > 0 ? propertyTypes.map(data => ({
    title: data.bookingid,
    description: `Price: ${formatEventDate(data.total_price)}`,
    start: data.checkin_date,
    end: addOneDay(data.checkout_date)
  })) : [];

  return (
    <div style={{ height: '70vh', width: 'auto', marginLeft }}>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        events={events}
        eventClick={handleOpen}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height={calendarHeight}
        

      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box sx={modalStyle}>
          <Box sx={headerStyle}>
            <Typography id="booking-modal-title" variant="h6" component="h2">
              Booking Details
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ width: '100%' }} />
          <Box sx={contentStyle}>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Booking ID:</strong></Typography>
              <Typography variant="body1">{eventInfo.bookingid}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Guest Name:</strong></Typography>
              <Typography variant="body1">{eventInfo.guestname}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Guest ID:</strong></Typography>
              <Typography variant="body1">{eventInfo.guestid}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Check-in Date:</strong></Typography>
              <Typography variant="body1">{eventInfo.checkin_date}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Check-out Date:</strong></Typography>
              <Typography variant="body1">{eventInfo.checkout_date}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Guest Count:</strong></Typography>
              <Typography variant="body1">{eventInfo.guest_count}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Unit Type:</strong></Typography>
              <Typography variant="body1">{eventInfo.unit_type}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Total Price:</strong></Typography>
              <Typography variant="body1">Php {eventInfo.total_price}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Special Request:</strong></Typography>
              <Typography variant="body1">{eventInfo.special_request}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Status:</strong></Typography>
              <Typography variant="body1">{eventInfo.status}</Typography>
            </Box>
          </Box>
          <Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
