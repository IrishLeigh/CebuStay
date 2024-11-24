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
  Grid,
  Box,
  useMediaQuery,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Lock from "@mui/icons-material/Lock";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

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
  const [showAllPasswords, setShowAllPasswords] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check if the screen size is mobile

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

  const handleSavePassword = async (e) => {
    e.preventDefault();

    const errors = [];
    const passwordRequirements = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    // Validate current password
    if (currentPassword !== profilePassword) {
      errors.push("Invalid current password.");
    }

    // Validate new password
    if (newPassword === currentPassword) {
      errors.push("New password cannot be the same as the current password.");
    }
    if (!passwordRequirements.test(newPassword)) {
      errors.push(
        "New password must be at least 8 characters long, contain one uppercase letter, and one special character."
      );
    }
    if (newPassword !== confirmNewPassword) {
      errors.push("New password and confirm password do not match.");
    }

    // Display errors if any
    if (errors.length > 0) {
      setSnackbarMessage(errors.join(" "));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(
        `https://whitesmoke-shark-473197.hostingersite.com/api/updateProfile/${profile.userid}`,
        {
          userid: profile.userid,
          old_password: currentPassword,
          password: newPassword,
        }
      );

      setSnackbarMessage("Password Successfully Changed");
      setSnackbarSeverity("success");
      setIsChanged(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.status === "invalid"
          ? "Invalid current password."
          : "An error occurred while changing the password."
      );
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setCurrentPassword(profile.currentPassword);
    setNewPassword("");
    setConfirmNewPassword("");
    setIsChanged(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper className="account-cntr" sx={{ borderRadius: "12px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="account-id-cntr">
            <div className="account-id-title">Account Sign-in</div>
            <div className="account-id-desc">
              We recommend that you periodically update your password to help
              prevent unauthorized access to your account.
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", p: "2rem" }}>
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

            {[
              {
                id: "current-password",
                label: "Current Password",
                value: currentPassword,
                setValue: setCurrentPassword,
                show: showCurrentPassword || showAllPasswords,
                toggle: () => setShowCurrentPassword((prev) => !prev),
              },
              {
                id: "new-password",
                label: "New Password",
                value: newPassword,
                setValue: setNewPassword,
                show: showNewPassword || showAllPasswords,
                toggle: () => setShowNewPassword((prev) => !prev),
              },
              {
                id: "confirm-new-password",
                label: "Confirm New Password",
                value: confirmNewPassword,
                setValue: setConfirmNewPassword,
                show: showConfirmNewPassword || showAllPasswords,
                toggle: () => setShowConfirmNewPassword((prev) => !prev),
              },
            ].map((field) => (
              <TextField
                required
                id={field.id}
                label={field.label}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                type={field.show ? "text" : "password"}
                fullWidth
                sx={{
                  p: isMobile ? "8px" : "16px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                InputProps={{
                  startAdornment: !isMobile && (
                    <InputAdornment
                      position="start"
                      sx={{ marginRight: "1rem" }}
                    >
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: !isMobile && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={`toggle ${field.label.toLowerCase()} visibility`}
                        onClick={field.toggle}
                        edge="end"
                      >
                        {field.show ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    paddingLeft: isMobile ? "8px" : "16px", // Adjust left padding to ensure alignment
                  },
                }}
              />
            ))}

            {isMobile && (
              <Box sx={{ mb: 2, ml: 1 }}>
                <Typography component="label">
                  <input
                    type="checkbox"
                    checked={showAllPasswords}
                    onChange={(e) => setShowAllPasswords(e.target.checked)}
                  />{" "}
                  Show All Passwords
                </Typography>
              </Box>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
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
                  isChanged
                    ? "cancel-btn-withChanges"
                    : "cancel-btn-withoutChanges"
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
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
