import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Stack, TextField, InputAdornment, Chip, Divider, Radio, RadioGroup, FormControlLabel, Select, MenuItem, Card } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Countries from '../../components/Booking/Countries';
import PhoneNumberInput from '../../components/Booking/PhoneNumber';
import axios from 'axios';

function BookingGuest({User, onGuestDetailsChange, PropertyData}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const policies = ['Non-refundable', 'Modificable if plans change', 'Maximum 2 Guests']; // Example facilities
  const [selectedCountry, setSelectedCountry] = useState('');
  const services = ['Room service', 'Free Wi-Fi', 'Airport shuttle']; // Example services
  const [bookingFor, setBookingFor] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [requests , setRequests] = useState('');
  const [arrival, setArrival] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setEmail(response.data["data"]["email"]);
          setFirstName(response.data["data"]["firstname"]);
          setLastName(response.data["data"]["lastname"]);
          console.log("User: ", response.data["data"]);
        })
        .catch((error) => {
          console.log("Error decoding JWT token:", error);
          // setUser(null);
        });
    } else {
      setEmail("ncietry");
          setFirstName("ncietry");
          setLastName("ncietry");
    }
  }, []);
  
  //callback
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };
  const handleCountryCodeChange = (countryCode) => {
    setCountryCode(countryCode);
  };
  
  const handleArrivalChange = (event) => {
    setArrivalTime(event.target.value);
  };

  const handlePhoneNumberChange = (phone) => {
    setPhoneNumber(phone);
  };
  
  const handleSpecialRequestChange = (event) => {
    setRequests(event.target.value);
  };

  // const handleArrivalChange = (event) => {
  //   setArrival(event.target.value);
  // };

 //convert time

 const convertTimeTo12HourFormat = (time) => {
  const [hours, minutes] = time.split(':');
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const twelveHourFormat = `${((hours + 11) % 12) + 1}:${minutes} ${amPm}`;
  return twelveHourFormat;
};
  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : '';
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleBookingForChange = (event) => {
    setBookingFor(event.target.value);
  };

  const handleGuestNameChange = (event) => {
    setGuestName(event.target.value);
  };

  const handleGuestEmailChange = (event) => {
    setGuestEmail(event.target.value);
  };


  console.log("Requests:",requests);

  useEffect(() => {
    if (bookingFor === 'myself') {
      setGuestName(`${firstName} ${lastName}`);
    } else {
      setGuestName('');
    }
  }, [bookingFor, firstName, lastName]);

  useEffect(() => {
    const guestDetails = {
      email,
      firstName,
      lastName,
      selectedCountry,
      bookingFor,
      guestName,
      guestEmail,
      arrivalTime,
      requests,
      phoneNumber,
      countryCode,
    };
    onGuestDetailsChange(guestDetails);
  }, [email, firstName, lastName, selectedCountry, countryCode, bookingFor, guestName, guestEmail, arrivalTime, requests, phoneNumber]);

console.log("User nga capital U",User);
console.log("PropertyData",PropertyData);

  return (
    <>
      <Box p={5} bgcolor="white">
      <Card 
          sx={{
            border: '0.1rem solid rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            borderRadius: '0.6rem',
            mt: 3,
            width: '100%',
            boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.15)',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="left"
          >
            <Avatar sx={{ width: 56, height: 56 }}>{getInitial(email)}</Avatar>
            <div>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold' }}>You are signed in as</Typography>
              <Typography sx={{ fontSize: '1rem' }}>{email}</Typography>
            </div>
          </Stack>
        </Card>
        <Card 
          sx={{
            border: '0.1rem solid rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            borderRadius: '0.6rem',
            mt: 3,
            width: '100%',
            boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.15)',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="stretch"
            justifyContent="left"
            width="100%"
          >
            <div style={{ width: '100%' }}>
              <Typography sx={{ fontSize: '1rem', mb: '0.5rem', fontWeight: 'bold' }}>First Name</Typography>
              <TextField 
                fullWidth
                color={firstName ? "success" : "primary"} 
                focused 
                value={firstName}
                onChange={handleFirstNameChange}
                InputProps={{
                  endAdornment: firstName ? (
                    <InputAdornment position="end">
                      <CheckIcon color="success" />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </div>
            <div style={{ width: '100%' }}>
              <Typography sx={{ fontSize: '1rem', mb: '0.5rem', fontWeight: 'bold' }}>Last Name</Typography>
              <TextField 
                fullWidth
                color={lastName ? "success" : "primary"} 
                focused 
                value={lastName}
                onChange={handleLastNameChange}
                InputProps={{
                  endAdornment: lastName ? (
                    <InputAdornment position="end">
                      <CheckIcon color="success" />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </div>
          </Stack>
          <Stack direction="column" fullWidth>
            <div style={{ width: '49%', marginTop: '1rem' }}>
              <Typography sx={{ fontSize: '1rem', mb: '0.5rem', fontWeight: 'bold' }}>Your email:</Typography>
              <TextField 
                fullWidth
                color={email ? "success" : "primary"} 
                focused 
                value={email}
                onChange={handleEmailChange}
                InputProps={{
                  endAdornment: email ? (
                    <InputAdornment position="end">
                      <CheckIcon color="success" />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </div>
            <Countries handleCountryChange={handleCountryChange} />
            <PhoneNumberInput 
              phoneNumber={phoneNumber}
              countryCode={countryCode}
              onPhoneNumberChange={handlePhoneNumberChange}
              onCountryCodeChange={handleCountryCodeChange}
            />
            <Divider sx={{ mt: '1rem' }} />
            <div style={{ width: '100%' }}>
              <Typography sx={{ fontSize: '1rem', mb: '0.5rem', fontWeight: 'bold', mt: '1rem' }}>Who are you booking for?</Typography>
              <RadioGroup value={bookingFor} onChange={handleBookingForChange} row>
                <FormControlLabel value="myself" control={<Radio />} label="I am booking for myself" />
                <FormControlLabel value="other" control={<Radio />} label="Booking for someone else" />
              </RadioGroup> 
            </div>
          </Stack>
        </Card>
        <Card 
          sx={{
            // border: '0.1rem solid #000000',
            padding: '1rem',
            borderRadius: '0.6rem',
            mt: 3,
            width: '100%',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
          }}
        >
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Property Type</Typography>
          <Typography sx={{ fontSize: '1rem', mt: '1rem' }}>
            Policies:
            <ul>
              {policies.map((policy, index) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
          </Typography>
          <Typography sx={{ fontSize: '1rem', mt: '1rem' }}>
            <Stack direction="row" spacing={1}>
              {services.map((service, index) => (
                <Chip key={index} label={service} />
              ))}
            </Stack>
          </Typography>
          <Divider sx={{ mt:'1rem' }} />
           {bookingFor === 'myself' ? (
            <div style={{ width: '49%' }}>
              <Typography sx={{ fontSize: '1rem', mb: '0.5rem', fontWeight: 'bold', mt: '1rem' }}>Guest Full Name:</Typography>
              <Typography>{guestName}</Typography>
            </div>
          ) : (
            <Stack direction="row" spacing={2} alignItems="stretch" justifyContent="left"  mt={1}>
              <div style={{ width: '49%' }}>
                <Typography sx={{ fontSize: '1rem', mb: '0.5rem', fontWeight: 'bold' }}>Guest Full Name:</Typography>
                <TextField 
                  fullWidth
                  color={guestName ? "success" : "primary"} 
                  focused 
                  value={guestName}
                  onChange={handleGuestNameChange}
                  InputProps={{
                    endAdornment: guestName ? (
                      <InputAdornment position="end">
                        <CheckIcon color="success" />
                      </InputAdornment>
                    ) : null,
                  }}
                />
              </div>
              <div sx={{display: 'flex', width: '100%'}}>
                <Typography sx={{ fontSize: '1rem', mb: '0.5rem', fontWeight: 'bold' }}>Guest Email:</Typography>
                <TextField 
                  fullWidth
                  color={guestEmail ? "success" : "primary"} 
                  focused 
                  value={guestEmail}
                  onChange={handleGuestEmailChange}
                  InputProps={{
                    endAdornment: guestEmail ? (
                      <InputAdornment position="end">
                        <CheckIcon color="success" />
                      </InputAdornment>
                    ) : null,
                  }}
                />

              </div>
            </Stack>
          )}
        </Card>
        {/* Special Requests */}
        <Card 
          sx={{
            border: '0.1rem solid rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            borderRadius: '0.6rem',
            mt: 3,
            width: '100%',
            boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Special Requests</Typography>
          <Typography sx={{ fontSize: '1rem', mt:'1rem' }}>
            Special requests cannot be guaranteed – but the property will do its best to meet your needs. You can always make a special request after your booking is complete!
          </Typography>
          <TextField
            id="filled-multiline-flexible"
            label="Please enter any special requests here"
            multiline
            maxRows={6}
            fullWidth
            value={requests}
            onChange={handleSpecialRequestChange}
            sx={{mt:'1rem'}}
          />
        </Card>
        {/* Arrival Time */}
        <Card 
          sx={{
            border: '0.1rem solid rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            borderRadius: '0.6rem',
            mt: 3,
            width: '100%',
            boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Your arrival time</Typography>
          <Typography sx={{ fontSize: '1rem', mt:'1rem' }}>
            Your can check-in between {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_in_from)} and {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_in_until)}
          </Typography>
          <Stack direction="column">
            <Typography sx={{ fontSize: '1rem', mt:'1rem' }}>
              Select your arrival time
            </Typography>
            <Select
              label="Arrival Time"
              fullWidth
              value={arrivalTime}
              onChange={handleArrivalChange}
            >
              {Array.from(Array(24).keys()).map(hour => (
                <MenuItem key={hour} value={`${hour}:00`}>{`${hour}:00 - ${hour + 1}:00`}</MenuItem>
              ))}
            </Select>
            
          </Stack>
        </Card>
      </Box>
    </>
  );
}

export default BookingGuest;