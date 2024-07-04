import React, { useState } from "react";
import "../css/AccountID.css";
import { Divider, TextField, InputAdornment, Paper } from "@mui/material";
// import AccountCircle from "@mui/icons-material/PermIdentity";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Lock from "@mui/icons-material/Lock";

export default function AccountSignIn() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleToggleShowCurrentPassword = () =>
    setShowCurrentPassword((prev) => !prev);
  const handleToggleShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const handleToggleShowConfirmNewPassword = () =>
    setShowConfirmNewPassword((prev) => !prev);

  return (
    <Paper className="account-cntr" sx={{ borderRadius: "12px" }}>
      <div className="account-id-cntr">
        <div className="account-id-title">Account Sign-in</div>
        <div className="account-id-desc">
          We recommend that you periodically update your password to help
          prevent unauthorized access to your account.
        </div>
      </div>

      <Divider orientation="vertical" sx={{ padding: "2rem" }} />

      {/* Current, New, Confirm New Password*/}
      <div className="account-id-cntr">
        <Typography
          variant="h6"
          sx={{
            marginBottom: "1rem",
            fontWeight: "bold",
            fontSize: "20px",
            color: "#6A6A6A",
          }}
        >
          Change Password
        </Typography>

        <TextField
          required
          id="current-password"
          label="Current Password"
          type={showCurrentPassword ? "text" : "password"}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                {/* <AccountCircle /> */}
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleShowCurrentPassword}
                  edge="end"
                >
                  {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          id="new-password"
          label="New Password"
          type={showNewPassword ? "text" : "password"}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                {/* <AccountCircle /> */}
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleShowNewPassword}
                  edge="end"
                >
                  {showNewPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          id="confirm-new-password"
          label="Confirm New Password"
          type={showConfirmNewPassword ? "text" : "password"}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                {/* <AccountCircle /> */}
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleShowConfirmNewPassword}
                  edge="end"
                >
                  {showConfirmNewPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
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
