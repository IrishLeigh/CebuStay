import React, { useState, useEffect } from "react";
import "../css/AccountID.css";
import { Divider, TextField, InputAdornment, Paper, CircularProgress } from "@mui/material";
import AccountCircle from '@mui/icons-material/PermIdentity';
import axios from 'axios'; // Import axios for making HTTP requests

export default function AccountID({ profile }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstname);
      setLastName(profile.lastname);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setIsChanged(firstName !== profile.firstname || lastName !== profile.lastname);
    }
  }, [firstName, lastName, profile]);

  const handleSaveName = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/updateProfile/${profile.userid}`, {
        // Assuming profile.userid exists for updating the profile
        userid: profile.userid,
        firstname: firstName,
        lastname: lastName,
      });
      console.log("Saved:", { firstName, lastName });
      setIsChanged(false); // Reset the state after saving
    } catch (error) {
      console.error('Failed to update data. Please try again later.', error);
      // Handle error state or display an error message to the user
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstname);
      setLastName(profile.lastname);
      setIsChanged(false); // Reset the state after cancelling
    }
  };

  if (!profile) {
    return <CircularProgress />; // Render a loader while profile data is loading or null
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
      </div>
    </Paper>
  );
}
