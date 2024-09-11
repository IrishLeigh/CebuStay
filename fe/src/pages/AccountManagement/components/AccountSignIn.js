import React, { useState, useEffect } from "react";
import "../css/AccountID.css";
import {
  Divider,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Lock from "@mui/icons-material/Lock";
import axios from "axios";

export default function AccountSignIn({ profile }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  // Update current password from profile
  useEffect(() => {
    if (profile) {
      setProfilePassword(profile.password);
    }
  }, [profile]);

  // Track changes to enable/disable the save button
  useEffect(() => {
    setIsChanged(newPassword.length > 0 && newPassword === confirmNewPassword);
  }, [newPassword, confirmNewPassword]);

  const handleToggleShowCurrentPassword = () =>
    setShowCurrentPassword((prev) => !prev);
  const handleToggleShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const handleToggleShowConfirmNewPassword = () =>
    setShowConfirmNewPassword((prev) => !prev);

  const handleSavePassword = async (e) => {
    e.preventDefault();
  
    // Check if the new password contains at least one capital letter or symbol
    const passwordRequirements = /^(?=.*[A-Z])(?=.*[\W_]).+$/;
  
    if (!newPassword.match(passwordRequirements)) {
      setSnackbarMessage("Password must contain at least one symbol or a capital letter");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return; // Stop further execution
    }
  
    // Check if new password matches the confirm password field
    if (newPassword !== confirmNewPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return; // Stop further execution
    }
  
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/updateProfile/${profile.userid}`,
        {
          userid: profile.userid,
          old_password: currentPassword, // Assuming currentPassword is the old password
          password: newPassword,
        }
      );
  
      // Password successfully changed
      setSnackbarMessage("Password Successfully Changed");
      setSnackbarSeverity("success");
      setIsChanged(false); // Reset the state after saving
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
  
    } catch (error) {
      console.error(error.response.data.message);
      // Handle error state or display an error message to the user
      
      if (error.response?.data?.status === "invalid") {
        setSnackbarMessage("Invalid Password");
      } else {
        setSnackbarMessage("An error occurred while changing the password");
      }
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true); // Always open the snackbar
    }
  };
  

  const handleCancel = () => {
    setCurrentPassword(profile.currentPassword);
    setNewPassword("");
    setConfirmNewPassword("");
    setIsChanged(false); // Reset the state after cancelling
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
            className={`save-btn ${
              isChanged ? "save-btn-withChanges" : "save-btn-withoutChanges"
            }`}
            onClick={handleSavePassword}
            disabled={!isChanged}
          >
            Save
          </button>
          <button
            className={`cancel-btn ${
              isChanged ? "cancel-btn-withChanges" : "cancel-btn-withoutChanges"
            }`}
            onClick={handleCancel}
            disabled={!isChanged}
          >
            Cancel
          </button>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </Paper>
  );
}
