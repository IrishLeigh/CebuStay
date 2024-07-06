import React, { useState, useEffect } from "react";
import "../css/AccountID.css";
import { Divider, TextField, InputAdornment, Paper, IconButton, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Lock from "@mui/icons-material/Lock";
import axios from "axios";

export default function AccountSignIn({ profile }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Update current password from profile
  useEffect(() => {
    if (profile) {
      setProfilePassword(profile.password);
    }
  }, [profile]);

 // Track changes to enable/disable the save button
 useEffect(() => {
  setIsChanged(
    newPassword.length > 0 &&
    newPassword === confirmNewPassword
  );
}, [newPassword, confirmNewPassword,]);

  const handleToggleShowCurrentPassword = () => setShowCurrentPassword((prev) => !prev);
  const handleToggleShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const handleToggleShowConfirmNewPassword = () => setShowConfirmNewPassword((prev) => !prev);

  const handleSavePassword = async (e) => {
    
  };

  const handleCancel = () => {
    setCurrentPassword(profile.currentPassword);
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChanged(false); // Reset the state after cancelling
  };

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
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          type={showCurrentPassword ? "text" : "password"}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
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
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type={showNewPassword ? "text" : "password"}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
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
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          type={showConfirmNewPassword ? "text" : "password"}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
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
          <button
            className={`save-btn ${isChanged ? 'save-btn-withChanges' : 'save-btn-withoutChanges'}`}
            onClick={handleSavePassword}
            disabled={!isChanged}
          >
            Save
          </button>
          <button
            className={`cancel-btn ${isChanged ? 'cancel-btn-withChanges' : 'cancel-btn-withoutChanges'}`}
            onClick={handleCancel}
            disabled={!isChanged}
          >
            Cancel
          </button>
        </div>
      </div>
    </Paper>
  );
}
