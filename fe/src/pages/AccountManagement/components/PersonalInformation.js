import React from "react";
import "../css/AccountID.css";
import { Divider, TextField, InputAdornment, Paper } from "@mui/material";
// import AccountCircle from "@mui/icons-material/PermIdentity";
import Email from "@mui/icons-material/Email";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Public from "@mui/icons-material/Public";
import Phone from "@mui/icons-material/Phone";

export default function PersonalInformation() {
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
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                {/* Change Icon Here */}
                <Email />
                {/* <AccountCircle /> */}
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          id="outlined-required"
          label="Birthday"
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
          id="outlined-required"
          label="Country"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                {/* Change Icon Here */}
                <Public />
                {/* <AccountCircle /> */}
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          id="outlined-required"
          label="Phone Number"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                {/* Change Icon Here */}
                <Phone />
                {/* <AccountCircle /> */}
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
