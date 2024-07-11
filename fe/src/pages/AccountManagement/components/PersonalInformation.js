import React, { useState } from "react";
import "../css/AccountID.css";
import {
  Divider,
  TextField,
  InputAdornment,
  Paper,
  MenuItem,
} from "@mui/material";
// import AccountCircle from "@mui/icons-material/PermIdentity";
import Email from "@mui/icons-material/Email";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Public from "@mui/icons-material/Public";
import Phone from "@mui/icons-material/Phone";

const countries = [
  { value: "USA", label: "USA", code: "+1" },
  { value: "Canada", label: "Canada", code: "+1" },
  { value: "Mexico", label: "Mexico", code: "+52" },
  { value: "Philippines", label: "Philippines", code: "+63" },
  // Add more countries as needed
];

export default function PersonalInformation({ loggedInUserEmail }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState("");
  const [email, setEmail] = useState(loggedInUserEmail);

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);

    // Set phone number prefix based on selected country
    const country = countries.find((c) => c.value === selectedCountry);
    if (country) {
      setPhoneNumberPrefix(country.code);
    }
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  return (
    <Paper className="account-cntr" sx={{ borderRadius: "12px" }}>
      <div className="account-id-cntr">
        <div className="account-id-title">Personal Information</div>
        <div className="account-id-desc">
          Your email address is essential for managing your Cebustay account. It
          enables you to access your profile, receive booking confirmations, and
          stay informed with the latest updates and offers. Keeping your email
          current ensures you don't miss any important communications.
        </div>
      </div>

      <Divider orientation="vertical" sx={{ padding: "2rem" }} />

      {/* Email, Birthday, Country, and Phone Number */}
      <div className="account-id-cntr">
        <TextField
          required
          id="outlined-required"
          label="Email"
          value={email}
          disabled={true} // Disable editing
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          id="outlined-required"
          label="Birthday"
          type="date"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                {/* Change Icon Here */}
                <CalendarToday />
                {/* <AccountCircle /> */}
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          id="outlined-required-country"
          select
          label="Country"
          value={selectedCountry}
          onChange={handleCountryChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                <Phone />
              </InputAdornment>
            ),
          }}
        >
          {/* Options for Select */}
          {countries.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          id="outlined-required-phone"
          label="Phone Number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                <span>{phoneNumberPrefix}</span>
              </InputAdornment>
            ),
          }}
        />

        <div className="account-btn-cntr">
          <button className="save-btn">Save</button>
          <button className="cancel-btn">Cancel</button>
        </div>
      </div>
    </Paper>
  );
}
