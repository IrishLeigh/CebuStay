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
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Email from "@mui/icons-material/Email";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Public from "@mui/icons-material/Public";
import Phone from "@mui/icons-material/Phone";
import axios from "axios";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateField } from "@mui/x-date-pickers/DateField"; // Import DateField for both desktop and mobile
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import countryCodesWithPatterns from "../../../components/Booking/countryCodes";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Check if the screen size is mobile

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
        Object.keys(countryCodesWithPatterns).find(
          (key) => key === profile.country
        ) || "";
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
      Object.keys(countryCodesWithPatterns).find(
        (key) => countryCodesWithPatterns[key].name === selectedCountry
      ) || "";
    setCountry(selectedCountry);
    setPhoneNumberPrefix(countryCode);
    setPhone(""); // Reset phone number when country changes
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Allow only digits and limit input to 11 digits
    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhone(value);
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();

    let phoneRegex;
    const countryData = countryCodesWithPatterns[phoneNumberPrefix];
    if (countryData) {
      phoneRegex = countryData.pattern; // Get pattern from country codes
    } else {
      phoneRegex = /^\d+$/; // Default regex
    }

    if (!phoneRegex.test(phone)) {
      setSnackbarMessage(
        `Invalid phone number format for ${country}. Please enter a valid number.`
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
        `https://whitesmoke-shark-473197.hostingersite.com/api/updateProfile/${profile.userid}`,
        {
          userid: profile.userid,
          birthday: formattedDate || null,
          country: country,
          cellnumber: phone,
        }
      );

      setSnackbarMessage("Personal information updated successfully!");
      setSnackbarSeverity("success");
      setBirthday(profile.birthday ? formatDate(profile.birthday) : "");
      setCountry(profile.country);
      setPhone(profile.cellnumber);
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="account-id-cntr">
            <div className="account-id-title">Personal Information</div>
            <div className="account-id-desc">
              Your email address is essential for managing your Cebustay
              account. It enables you to access your profile, receive booking
              confirmations, and stay informed with the latest updates and
              offers. Keeping your email current ensures you don't miss any
              important communications.
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", p: "2rem" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                label="Birthday"
                value={birthday ? dayjs(birthday) : null}
                onChange={(date) =>
                  setBirthday(date ? date.format("YYYY-MM-DD") : "")
                }
                fullWidth
              />
            </LocalizationProvider>

            <TextField
              required
              id="outlined-required-country"
              select
              label="Country"
              value={country}
              onChange={handleCountryChange}
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  paddingRight: isMobile ? "3rem" : "1rem", // Adjust padding for mobile
                },
                "& .MuiSelect-select": {
                  paddingLeft: isMobile ? "3rem" : "0rem", // Adjust padding-left for mobile
                },
              }}
              InputProps={{
                startAdornment: !isMobile && (
                  <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                    <Public />
                  </InputAdornment>
                ),
              }}
            >
              {Object.keys(countryCodesWithPatterns)
                .map((key) => ({
                  code: key,
                  name: countryCodesWithPatterns[key].name,
                }))
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
                .map((item) => (
                  <MenuItem key={item.code} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              required
              id="outlined-phone"
              label="Phone Number"
              value={phone}
              onChange={handlePhoneChange}
              fullWidth
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              InputProps={{
                startAdornment: !isMobile && (
                  <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
                    {phoneNumberPrefix}
                  </InputAdornment>
                ),
                sx: {
                  paddingLeft: isMobile ? "8px" : "16px", // Adjust left padding to ensure alignment
                },
                inputMode: "numeric",
              }}
            />

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
                onClick={handleSaveInfo}
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
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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
    </Paper>
  );
}
