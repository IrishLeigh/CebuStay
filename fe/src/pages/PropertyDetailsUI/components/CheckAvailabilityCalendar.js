import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from '@mui/material/Modal';
import axios from "axios";
import '../css/CheckAvailabilityCalendar.css';
import {useParams} from "react-router-dom";

import FullCalendar from "@fullcalendar/react";


const CheckAvailabilityCalendar = () => {
  const [propertyData, setPropertyData] = useState([]);
  const { propertyid } = useParams(); // Retrieve propertyid from URL
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [unitTypes, setUnitTypes] = useState({});
  const [propertyTypes, setPropertyTypes] = useState({});
  const [home, setHome] = useState(true);
  const [open, setOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState({ title: '', bookingid: 0, description: '', start: '', end: '' });
  const [calendarHeight, setCalendarHeight] = useState('auto');
  const [marginLeft, setMarginLeft] = useState('auto');

  const [headerToolbar, setHeaderToolbar] = useState({
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  });
  //TODO: uncomment this if local storage does not work
 const userid = localStorage.getItem("userid") || null;

  const handlePropertyChange = (event) => {
    const propertyDataName = event.target.value;
    setSelectedProperty(propertyDataName);

    const selectedPropertyName = event.target.value;
    const filteredProperties = propertyData.filter(
      (property) => property.property_name === selectedPropertyName
    );
    if (filteredProperties[0].property_type !== "Home") {
      setHome(false);
    }

    setPropertyTypes(filteredProperties);
  };

  const handleUnitTypeChange = (event) => {
    setSelectedUnitType(event.target.value);
    setUnitTypes(event.target.value);
  };
 

  useEffect(() => {
    const fetchData = async () => {
      if (!userid) return;
      try {
        const propertyres = await axios.get(
          "http://127.0.0.1:8000/api/property/allbookings",
          {
            params: {
              propertyid: propertyid,
            },
          }
        );
        setPropertyData(propertyres.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userid]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 370) {
        // Adjust for very small screens (e.g., 370px or less)
        document.querySelector('.fc-toolbar-title').style.fontSize = '.6rem';
        document.querySelector('.fc-toolbar-title').style.margin = '0px 2px';
        document.querySelector('.fc-toolbar-title').style.textAlign = 'center';
        document.querySelectorAll('.fc-prev-button, .fc-next-button, .fc-today-button').forEach(button => {
          button.style.fontSize = '.4rem';
          button.style.padding = '3px 5px';
        });
        document.querySelectorAll('.fc-dayGridMonth-button, .fc-timeGridWeek-button, .fc-timeGridDay-button').forEach(button => {
          button.style.fontSize = '8px';
          button.style.padding = '2px 4px';
          button.style.margin = '3px 1px';
        });
      } else if (window.innerWidth < 768) {
        // Adjust for smaller screens
        document.querySelector('.fc-toolbar-title').style.fontSize = '.75rem';
        document.querySelector('.fc-toolbar-title').style.margin = '0px 5px';
        document.querySelector('.fc-toolbar-title').style.textAlign = 'center';
        document.querySelectorAll('.fc-prev-button, .fc-next-button, .fc-today-button').forEach(button => {
          button.style.fontSize = '.5rem';
          button.style.padding = '5px 8px';
        });
        document.querySelectorAll('.fc-dayGridMonth-button, .fc-timeGridWeek-button, .fc-timeGridDay-button').forEach(button => {
          button.style.fontSize = '10px';
          button.style.padding = '3px 8px';
          button.style.margin = '5px 1px';
        });
      } else {
        // Default toolbar for larger screens
        document.querySelector('.fc-toolbar-title').style.fontSize = '1.25rem';
        document.querySelectorAll('.fc-prev-button, .fc-next-button, .fc-today-button').forEach(button => {
          button.style.fontSize = '14px';
          button.style.padding = '5px 10px';
        });
        document.querySelectorAll('.fc-dayGridMonth-button, .fc-timeGridWeek-button, .fc-timeGridDay-button').forEach(button => {
          button.style.fontSize = '14px';
          button.style.padding = '5px 10px';
        });
      }
    };
  
    // Initial check
    handleResize();
  
    // Add resize listener
    window.addEventListener('resize', handleResize);
  
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  useEffect(() => {
    const updateCalendarHeight = () => {
      if (window.innerWidth <= 600) {
        setCalendarHeight('auto');
      } else {
        setCalendarHeight('100%');
      }

      if (window.innerWidth < 1650) {
        // setMarginLeft('10rem'); 
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
    const propertyDetails = propertyTypes.find(property => property.bookingid == info.event.extendedProps.bookingid);
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
console.log( 'propertytypes',propertyData);
  const events = propertyData.length > 0 ? propertyData.map(data => ({
    // title: data.guestname,
    bookingid: data.bookingid,
    description: `Price: ${formatEventDate(data.total_price)}`,
    start: data.checkin_date,
    end: addOneDay(data.checkout_date)
  })) : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'; // Handle cases where date is not available
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

 
  // console.log('Property Data', propertyData);
  // console.log('Property ID', propertyid);

  return (
    <>
      <div style={{ height: '70vh', width: 'auto', marginLeft, paddingLeft: '1rem', paddingRight: '1rem' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        events={events}
        // eventClick={handleOpen}
        eventColor="#16B4DD"
        headerToolbar={headerToolbar}
        height={calendarHeight}
        dayHeaderFormat={{
          weekday: window.innerWidth < 370 ? 'narrow' : 'long', // Use initials for narrow screens
        }}
        

      />
      {/* <Modal
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
              <Typography variant="body1">{formatDate(eventInfo.checkin_date)}</Typography>
            </Box>
            <Box sx={fieldStyle}>
              <Typography variant="body1"><strong>Check-out Date:</strong></Typography>
              <Typography variant="body1">{formatDate(eventInfo.checkout_date)}</Typography>
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
      </Modal> */}
    </div>
      
    </>
  );
};

export default CheckAvailabilityCalendar;
