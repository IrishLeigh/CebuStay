import React, { useState, useEffect } from "react";
import "../css/AccountID.css";
import { Divider, TextField, InputAdornment, Paper, CircularProgress, Snackbar, Alert } from "@mui/material";
import AccountCircle from '@mui/icons-material/PermIdentity';
import axios from 'axios';

export default function AccountID({ profile, onUpdateProfile }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editedProfile, setEditedProfile] = useState(null); // State to hold edited profile data

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstname);
      setLastName(profile.lastname);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setIsChanged(firstName !== profile.firstname || lastName !== profile.lastname);
      setEditedProfile({
        ...profile,
        firstname: firstName,
        lastname: lastName
      });
    }
  }, [firstName, lastName, profile]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/updateProfile/${profile.userid}`, {
        userid: profile.userid,
        firstname: firstName,
        lastname: lastName,
      });

      setSnackbarMessage("Personal information updated successfully!");
      setSnackbarSeverity("success");
      setIsChanged(false);
      if (onUpdateProfile) {
        onUpdateProfile(editedProfile); // Pass updated profile back to parent component
      }
    } catch (error) {
      setSnackbarMessage("Failed to update data. Please try again later.");
      setSnackbarSeverity("error");
      console.error('Failed to update data. Please try again later.', error);
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstname);
      setLastName(profile.lastname);
      setIsChanged(false);
    }
  };

  if (!profile) {
    return <CircularProgress />;
  }

  return (
    <Paper className="account-cntr" sx={{ borderRadius: '12px' }}>
      <div className="account-id-cntr">
        <div className="account-id-title">Cebustay ID</div>
        <div className="account-id-desc">
          Your unique Cebustay ID is used to help others find and identify you on our booking platform. It is displayed in your bookings and profile information.
        </div>
      </div>

      <Divider orientation="vertical" sx={{ padding: '2rem' }} />

      {/* First name and last name fields */}
      <div className="account-id-cntr">
        <TextField
          required
          id="outlined-required"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: '1rem' }}>
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          id="outlined-required"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: '1rem' }}>
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
        <div className="account-btn-cntr">
          <button
            className={`save-btn ${isChanged ? 'save-btn-withChanges' : 'save-btn-withoutChanges'}`}
            onClick={handleSaveName}
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
