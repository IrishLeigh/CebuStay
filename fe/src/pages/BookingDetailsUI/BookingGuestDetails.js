import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  Card,
  Grid,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Countries from "../../components/Booking/Countries";
import PhoneNumberInput from "../../components/Booking/PhoneNumber";
import { ThemeProvider } from "@mui/material/styles";
import BookingGuestTheme from "./theme/bookingGuestTheme";

function BookingGuest({ User, onGuestDetailsChange, PropertyData, errorMessage }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const policies = [
    "Non-refundable",
    "Modifiable if plans change",
    "Maximum 2 Guests",
  ]; // Example facilities
  const [selectedCountry, setSelectedCountry] = useState("");
  const services = ["Room service", "Free Wi-Fi", "Airport shuttle"]; // Example services
  const [bookingFor, setBookingFor] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [requests, setRequests] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const handleCountryChange = (country) => setSelectedCountry(country);
  const handleCountryCodeChange = (countryCode) => setCountryCode(countryCode);
  const handleArrivalChange = (event) => setArrivalTime(event.target.value);
  const handlePhoneNumberChange = (phone) => setPhoneNumber(phone);
  const handleSpecialRequestChange = (event) => setRequests(event.target.value);

  const convertTimeTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const amPm = hours >= 12 ? "PM" : "AM";
    const twelveHourFormat = `${((hours + 11) % 12) + 1}:${minutes} ${amPm}`;
    return twelveHourFormat;
  };
  const getInitial = (email) => (email ? email.charAt(0).toUpperCase() : "");
  const handleFirstNameChange = (event) => setFirstName(event.target.value);
  const handleLastNameChange = (event) => setLastName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleBookingForChange = (event) =>
    setBookingFor(parseInt(event.target.value)); // Update value as integer
  const handleGuestNameChange = (event) => setGuestName(event.target.value);
  const handleGuestEmailChange = (event) => setGuestEmail(event.target.value);

  useEffect(() => {
    if (bookingFor === 1) {
      // If booking for myself
      setGuestName(`${firstName} ${lastName}`);
    } else {
      setGuestName("");
    }
  }, [bookingFor, firstName, lastName]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!User) {
      setEmail("");
      setFirstName("");
      setLastName("");
    } else {
      setEmail(User.email);
      setFirstName(User.firstname);
      setLastName(User.lastname);
    }
  }, [User]);

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
    console.log("Guest Details",guestDetails);
    onGuestDetailsChange(guestDetails);
  }, [
    email,
    firstName,
    lastName,
    selectedCountry,
    countryCode,
    bookingFor,
    guestName,
    guestEmail,
    arrivalTime,
    requests,
    phoneNumber,
    onGuestDetailsChange,
  ]);

  console.log("Error message",errorMessage);

  return (
    <ThemeProvider theme={BookingGuestTheme}>
      <Box sx={{ borderRadius: "8px", marginTop: "2rem" }}>
        <Card>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="left"
          >
            <Avatar sx={{ width: 56, height: 56 }}>{getInitial(email)}</Avatar>
            <div>
              <Typography variant="body1">You are signed in as</Typography>
              <Typography variant="h6">{email}</Typography>
            </div>
          </Stack>
        </Card>

        <Card sx={BookingGuestTheme.customStyles.borderCard}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="stretch"
            justifyContent="left"
            width="100%"
          >
            <div style={{ width: "100%" }}>
              <Typography>First Name</Typography>
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
                disabled
                helperText="The booker's name is the person currently signed in."
                required
              />
            </div>
            <div style={{ width: "100%" }}>
              <Typography>Last Name</Typography>
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
                disabled
                required
              />
            </div>
          </Stack>
          <Stack direction="column" fullWidth>
            <div style={{ width: "49%", marginTop: "1rem" }}>
              <Typography>Your email:</Typography>
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
                disabled
                required
              />
            </div>
            <PhoneNumberInput
              phoneNumber={phoneNumber}
              countryCode={countryCode}
              onPhoneNumberChange={handlePhoneNumberChange}
              onCountryCodeChange={handleCountryCodeChange}
            />
            {!phoneNumber && errorMessage.includes("Please enter phone number") && (
              <Typography sx={{ fontSize: "0.875rem" }}color="error">Please enter phone number</Typography>
            )}
            <div style={{ width: "100%", marginTop: "16px" }}>
              <Typography>Who are you booking for?</Typography>
              <RadioGroup
                row
                value={bookingFor}
                onChange={handleBookingForChange}
                sx={{ justifyContent: "flex-start" }}
                required
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="I am booking for myself"
                />
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label="Booking for someone else"
                />
              </RadioGroup>
            </div>
          </Stack>
        </Card>
        {bookingFor !== 1 && (
          <Card>
            <Typography sx={{ marginBottom: "1rem", fontWeight: "bold" }}>
              Booking For Other Guest Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>Guest Name</Typography>
                <TextField
                  fullWidth
                  value={guestName}
                  onChange={handleGuestNameChange}
                />
                {errorMessage.includes("Please enter guest name") && (
                  <Typography sx={{ fontSize: "0.875rem" }}color="error">Please enter guest name</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Guest Email</Typography>
                <TextField
                  fullWidth
                  value={guestEmail}
                  onChange={handleGuestEmailChange}
                />
                {errorMessage.includes("Please enter guest email") && (
                <Typography sx={{ fontSize: "0.875rem" }}color="error">Please enter guest email</Typography>
              )}
              </Grid>
              
            </Grid>
          </Card>
        )}

        <Card sx={BookingGuestTheme.customStyles.borderCard}>
          <Typography sx={{ marginBottom: "1rem", fontWeight: "bold" }}>
            Special Requests
          </Typography>
          <Typography>
            Special requests cannot be guaranteed – but the property will do its
            best to meet your needs. You can always make a special request after
            your booking is complete!
          </Typography>
          <TextField
            id="filled-multiline-flexible"
            label="Please enter any special requests here"
            multiline
            maxRows={6}
            fullWidth
            value={requests}
            onChange={handleSpecialRequestChange}
            sx={BookingGuestTheme.customStyles.specialRequestTextField}
          />
          {!requests && errorMessage.includes("Please enter special request") && (
            <Typography sx={{ fontSize: "0.875rem" }}color="error">Please enter special requests</Typography>
          )}
        </Card>

        <Card sx={BookingGuestTheme.customStyles.borderCard}>
          <Typography sx={{ marginBottom: "1rem", fontWeight: "bold" }}>
            Your arrival time
          </Typography>
          <Typography sx={{ marginBottom: "1rem" }}> 
            You can check-in on or after {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_in_from)} . Pick a check-in time below.
          </Typography>
          <Stack direction="column">
            <TextField
              label="Arrival Time"
              type="time"
              fullWidth
              value={arrivalTime}
              onChange={handleArrivalChange}
              InputLabelProps={{
                shrink: true, // Keeps the label on top even when input is filled
              }}
              inputProps={{
                step: 3600, // Ensures the time can only be selected in whole hours (3600 seconds)
              }}
            />
            {!arrivalTime &&errorMessage.includes("Please select arrival time") && (
              <Typography sx={{ fontSize: "0.875rem" }}color="error">Please select arrival time</Typography>
            )}
          </Stack>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default BookingGuest;
