import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "../css/ReservationSection.css";
import CheckAvailabilityCalendar from "./CheckAvailabilityCalendar"; // Adjust the path as needed

export default function ReservationSection({
  checkInDate,
  checkOutDate,
  handleCheckInChange,
  handleCheckOutChange,
  handleReserveClick,
  guestCount,
  handleGuestCountChange,
  propertyinfo,
}) {
  const [propertyInfo, setPropertyInfo] = useState();
  const [price, setPrice] = useState(0);
  const [isDaily, setIsDaily] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false); // State for modal

  useEffect(() => {
    if (propertyinfo) {
      setPropertyInfo(propertyinfo);
      const minPrice = propertyinfo?.property_unitdetails?.[0]?.unitpricing?.min_price || 1000;
      setPrice(minPrice);
      setIsDaily(propertyinfo?.property_details.unit_type === "Daily Term");
    }
  }, [propertyinfo]);

  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      setNotification("");
      setError("");
      return;
    }

    if (isDaily) {
      setError("");
      setNotification("");
      return;
    }

    const diffDays = checkOutDate.diff(checkInDate, "day");

    if (diffDays < 31) {
      setError("Minimum stay for monthly bookings is 31 days.");
      setSnackbarOpen(true);
      setNotification("");
    } else {
      setError("");
      const currentMonths = Math.floor(diffDays / 31);
      const remainingDays = diffDays % 31;
      const monthsToCharge = Math.ceil(diffDays / 31);

      if (remainingDays > 0) {
        setNotification(
          `You set ${currentMonths} month${currentMonths > 1 ? "s" : ""} and ${remainingDays} day${
            remainingDays > 1 ? "s" : ""
          }, but you will be charged for ${monthsToCharge} month${
            monthsToCharge > 1 ? "s" : ""
          }. We recommend setting to full month.`
        );
      } else {
        setNotification("");
      }
    }
  }, [checkInDate, checkOutDate, isDaily]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatPrice = (price) => {
    const validPrice = price && !isNaN(price) ? price : 0;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(validPrice);
  };

  return (
    <Paper className="reservation-cntr" sx={{ borderRadius: "0.8rem" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="reservation-price">{formatPrice(price)}</div>
          <div className="reservation-night">{isDaily ? "per night" : "per month"}</div>
        </div>
        <div className="reservation-details">
          <div className="checkin-out-cntr">
            <div className="date-picker-cntr">
              <DatePicker
                label="Check-in"
                value={checkInDate}
                onChange={handleCheckInChange}
                minDate={dayjs()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                  },
                }}
              />
            </div>

            <div className="date-picker-cntr">
              <DatePicker
                label="Check-out"
                value={checkOutDate}
                onChange={handleCheckOutChange}
                minDate={checkInDate ? checkInDate.add(1, "day") : dayjs()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderTopRightRadius: "12px",
                    borderBottomRightRadius: "12px",
                  },
                }}
              />
            </div>
          </div>
          <TextField
            type="number"
            value={guestCount || ""}
            onChange={handleGuestCountChange}
            fullWidth
            label="Guests"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 1, max: 50 }}
            mt={3}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {checkInDate && checkOutDate && notification && (
            <Typography color="warning" variant="body2" sx={{ mt: 2 }}>
              {notification}
            </Typography>
          )}
        </div>
      </LocalizationProvider>

      <button
        className="reserve-btn"
        onClick={handleReserveClick}
        disabled={!!error}
        style={{ marginTop: "2rem" }}
      >
        Reserve Here
      </button>
      <button
        className="reserve-btn"
        style={{ backgroundColor: "#ADC939", color: "white", cursor: "pointer" }}
        onClick={() => setOpenModal(true)} // Open modal
      >
        Check Availability
      </button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Check Availability</DialogTitle>
        <DialogContent>
          <CheckAvailabilityCalendar />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
