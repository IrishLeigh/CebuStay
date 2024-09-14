import React, { useState, useEffect } from "react";
import "../css/AccountID.css";
import {
  Divider,
  TextField,
  InputAdornment,
  Paper,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Email from "@mui/icons-material/Email";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Public from "@mui/icons-material/Public";
import Phone from "@mui/icons-material/Phone";
import axios from "axios";

const countries = [
  { value: "USA", label: "USA", code: "+1" },
  { value: "Canada", label: "Canada", code: "+1" },
  { value: "Mexico", label: "Mexico", code: "+52" },
  { value: "Philippines", label: "Philippines", code: "+63" },
  // Add more countries as needed
];

export default function PersonalInformation({ profile, onUpdateProfile }) {
  const [country, setCountry] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editedProfile, setEditedProfile] = useState(null); // State to hold edited profile data

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (profile) {
      setBirthday(profile.birthday ? formatDate(profile.birthday) : "");
      setCountry(profile.country);
      setPhone(profile.cellnumber);
      const countryCode =
        countries.find((c) => c.value === profile.country)?.code || "";
      setPhoneNumberPrefix(countryCode);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setIsChanged(
        (profile.birthday ? formatDate(profile.birthday) : "") !== birthday ||
          country !== profile.country ||
          phone !== profile.cellnumber
      );
      setEditedProfile({
        ...profile,
        birthday: birthday,
        country: country,
        cellnumber: phone,
      });
    }
  }, [birthday, country, phone, profile]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const countryCode =
      countries.find((c) => c.value === selectedCountry)?.code || "";
    setCountry(selectedCountry);
    setPhoneNumberPrefix(countryCode);
    setPhone(""); // Reset phone number when country changes
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setSnackbarMessage(
        "Invalid phone number format. Please enter a valid 11-digit mobile number starting with 09 (e.g., 09123456789)."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const selectedDate = new Date(birthday);
    const today = new Date();
    const minAgeDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    if (selectedDate > minAgeDate) {
      setSnackbarMessage("You must be at least 18 years old to proceed.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await axios.put(
        `http://127.0.0.1:8000/api/updateProfile/${profile.userid}`,
        {
          userid: profile.userid,
          birthday: formattedDate || null,
          country: country,
          cellnumber: phone,
        }
      );

      setSnackbarMessage("Personal information updated successfully!");
      setSnackbarSeverity("success");
      setIsChanged(false);
      if (onUpdateProfile) {
        onUpdateProfile(editedProfile); // Pass updated profile back to parent component
      }
    } catch (error) {
      setSnackbarMessage("Failed to update data. Please try again later.");
      setSnackbarSeverity("error");
      console.error("Failed to update data. Please try again later.", error);
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setBirthday(profile.birthday ? formatDate(profile.birthday) : "");
      setCountry(profile.country);
      setPhone(profile.cellnumber);
      setIsChanged(false);
    }
  };

  if (!profile) {
    return <CircularProgress />;
  }

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
          label="Birthday"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                <CalendarToday />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          id="outlined-required-country"
          select
          label="Country"
          value={country}
          onChange={handleCountryChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                <Public />
              </InputAdornment>
            ),
          }}
        >
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
          value={phone}
          onChange={handlePhoneChange}
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
            startAdornment: (
              <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                {phoneNumberPrefix}
              </InputAdornment>
            ),
          }}
        />

        <div className="account-btn-cntr">
          <button
            className={`save-btn ${
              isChanged ? "save-btn-withChanges" : "save-btn-withoutChanges"
            }`}
            onClick={handleSaveInfo}
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
