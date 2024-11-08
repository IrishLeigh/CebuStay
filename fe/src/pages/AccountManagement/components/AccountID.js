import React, { useState, useEffect } from "react";
import "../css/AccountID.css";
import {
  Divider,
  TextField,
  InputAdornment,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Box,
  useTheme, // Added useTheme
  useMediaQuery, // Added useMediaQuery
} from "@mui/material";
import AccountCircle from "@mui/icons-material/PermIdentity";
import axios from "axios";

export default function AccountID({ profile, onUpdateProfile }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check if the screen size is mobile

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstname);
      setLastName(profile.lastname);
    }
  }, [profile]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();

    const namePattern = /^[A-Za-z\s]+$/;

    // Validate names
    if (!namePattern.test(firstName)) {
      showSnackbar(
        "Invalid first name. Only alphabetic characters are allowed.",
        "error"
      );
      return;
    }
    if (!namePattern.test(lastName)) {
      showSnackbar(
        "Invalid last name. Only alphabetic characters are allowed.",
        "error"
      );
      return;
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/updateProfile/${profile.userid}`,
        {
          userid: profile.userid,
          firstname: firstName,
          lastname: lastName,
        }
      );

      showSnackbar("Personal information updated successfully!", "success");
      onUpdateProfile({ ...profile, firstname: firstName, lastname: lastName });
    } catch (error) {
      console.error("Failed to update data. Please try again later.", error);
      showSnackbar("Failed to update data. Please try again later.", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstname);
      setLastName(profile.lastname);
    }
  };

  if (!profile) {
    return <CircularProgress />;
  }

  return (
    <Paper className="account-cntr" sx={{ borderRadius: "12px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="account-id-cntr">
            <h2 className="account-id-title">Cebustay ID</h2>
            <p className="account-id-desc">
              Your unique Cebustay ID is used to help others find and identify
              you on our booking platform. It is displayed in your bookings and
              profile information.
            </p>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", p: "2rem" }}>
          <TextField
            required
            label="First Name"
            value={firstName}
            fullWidth
            onChange={(e) => setFirstName(e.target.value)}
            sx={{
              mb: 2, // Add margin bottom for spacing
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                display: "flex", // Ensure flex layout for alignment
              },
            }}
            InputProps={{
              startAdornment: !isMobile && (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
              sx: {
                paddingLeft: isMobile ? '8px' : '16px', // Adjust left padding to ensure alignment
              }
            }}
          />

            <TextField
              required
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              sx={{
                mb: 2, // Add margin bottom for spacing
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              InputProps={{
                startAdornment: !isMobile && (
                  <InputAdornment
                    position="start"
                    
                  >
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <div>
              <button
                className={`save-btn ${
                  firstName !== profile.firstname ||
                  lastName !== profile.lastname
                    ? "save-btn-withChanges"
                    : "save-btn-withoutChanges"
                }`}
                onClick={handleSaveName}
                disabled={
                  firstName === profile.firstname &&
                  lastName === profile.lastname
                }
              >
                Save
              </button>
              <button
                className={`cancel-btn ${
                  firstName !== profile.firstname ||
                  lastName !== profile.lastname
                    ? "cancel-btn-withChanges"
                    : "cancel-btn-withoutChanges"
                }`}
                onClick={handleCancel}
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
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
