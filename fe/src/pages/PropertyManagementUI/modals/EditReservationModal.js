import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";

const EditReservationModal = ({ open, handleClose, reservation }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [calculateNights, setCalculateNights] = useState(0);

  // const checkIn = "2024-12-20";
  // const checkOut = "2024-12-21";
  const [special, setSpecial] = useState("so here it is, hehehehe");

  // fetch data to put reservations
  useEffect(() => {
    if (reservation) {
      setCheckIn(reservation.checkin_date);
      setCheckOut(reservation.checkout_date);
    }
  }, [reservation]);

  const getDateParts = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  const checkInParts = getDateParts(checkIn);

  if (!reservation) {
    return null;
  }

  const handleCheckIn = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`; // Get the date in YYYY-MM-DD format

      console.log("Formatted Date:", formattedDate);
      console.log("Check-in:", reservation.checkin_date);
      console.log("Checkout:", reservation.checkout_date);

      // Ensure reservation data is valid
      if (
        !reservation ||
        !reservation.bookingid ||
        !reservation.checkin_date ||
        !reservation.checkout_date
      ) {
        alert("Reservation data is incomplete.");
        return;
      }

      // Check if today is on or after the check-in date and on or before the checkout date
      if (
        formattedDate >= reservation.checkin_date &&
        formattedDate <= reservation.checkout_date
      ) {
        const checkinres = await axios.post(
          "https://whitesmoke-shark-473197.hostingersite.com/api/setcheckin",
          {
            bookingid: reservation.bookingid,
          }
        );

        if (checkinres.data.status === "success") {
          console.log(checkinres.data.message);
          alert("Guest checked in successfully.");
        } else {
          console.error("Error checking in:", checkinres.data.message);
          alert("An error occurred during check-in. Please try again.");
        }

        console.log("Checked-in");
      } else {
        alert("Cannot check-in before check-in date or after checkout date.");
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      alert("An error occurred during check-in. Please try again.");
    }
  };

  const handleCheckOut = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`; // Get the date in YYYY-MM-DD format

      console.log("Formatted Date:", formattedDate);
      console.log("Checkout:", reservation.checkout_date);

      // Ensure reservation data is valid
      if (
        !reservation ||
        !reservation.bookingid ||
        !reservation.checkout_date
      ) {
        alert("Reservation data is incomplete.");
        return;
      }

      // Check if today is on or before the checkout date and not before the check-in date
      if (
        formattedDate >= reservation.checkin_date ||
        formattedDate <= reservation.checkout_date
      ) {
        const checkoutStat = await axios.post(
          "https://whitesmoke-shark-473197.hostingersite.com/api/setcheckout",
          {
            bookingid: reservation.bookingid,
          }
        );
        alert("Guest Successfully Checked-out!");

        console.log("Checked-out", checkoutStat.data);
        handleClose();
      } else {
        alert("Cannot check-out before check-in or after checkout date.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      console.log("BOOKING ID:", reservation.bookingid);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  const calulateNights = () => {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setCalculateNights(diffDays);
  };

  console.log("Reservation ", reservation);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "55rem",
          maxHeight: "80vh", // Maximum height
          overflowY: "auto", // Enable vertical scrolling
          bgcolor: "#16B4DD",
          boxShadow: 24,
          p: 4,
        }}
      >
        <img
          src="/guestHeader.png"
          alt="Guest Header"
          style={{ width: "100%", marginBottom: "-0.5rem" }}
        />
        <Paper sx={{ p: 4 }}>
          <Typography
            sx={{ fontSize: "2rem", color: "#16B4DD", fontWeight: "bold" }}
          >
            Booking Details
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1,
              m: 1,
            }}
          >
            <Stack direction="column">
              <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {reservation.property_name}
              </Typography>
              <Typography sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                123, address, street, Cebu City
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckIcon sx={{ fontSize: "1.125rem", mr: 1 }} />
                <Typography sx={{ fontSize: "1.125rem" }}>
                  {reservation.property_type}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckIcon sx={{ fontSize: "1.125rem", mr: 1 }} />
                <Typography sx={{ fontSize: "1.125rem" }}>
                  {reservation.unit_type}
                </Typography>
              </Box>
            </Stack>
            <Paper
              sx={{
                height: "auto",
                width: "10rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
                p: 1,
                borderRadius: "8px",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "2.5rem",
                  color: "#A334CF",
                  fontWeight: "bold",
                }}
              >
                {checkInParts.day}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  color: "#A334CF",
                  fontWeight: "bold",
                }}
              >
                {checkInParts.month}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
                <KeyIcon sx={{ fontSize: "1rem", mr: 1 }} />
                <Typography sx={{ fontSize: "0.9rem" }}>{checkIn}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
                <KeyOffIcon sx={{ fontSize: "1rem", mr: 1 }} />
                <Typography sx={{ fontSize: "0.9rem" }}>{checkOut}</Typography>
              </Box>
              <Divider sx={{ width: "80%", my: 1 }} />
              <Typography sx={{ fontSize: "1rem", color: "grey", mb: 0.5 }}>
                Booking ID:
              </Typography>
              <Typography sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                #{reservation.booker.bookerid}
              </Typography>
            </Paper>
          </Box>
          <Divider />

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#A334CF", color: "white" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Number of Guests
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Nights
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Payment
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "white" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{reservation.guest_count} guest/s</TableCell>
                  <TableCell>{reservation.stay_length}</TableCell>
                  <TableCell> Php {reservation.total_price}</TableCell>
                  <TableCell>{reservation.status}</TableCell>
                  <TableCell>
                    {reservation.type === "booking" ? "Checked-in" : "Upcoming"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label="Checked-in"
                        variant="outlined"
                        sx={{
                          backgroundColor: "#4CAF50",
                          color: "#FFFFFF",
                          borderColor: "#4CAF50",
                          "&:hover": { backgroundColor: "#388E3C" },
                        }}
                        onClick={handleCheckIn}
                      />
                      <Chip
                        label="Checked-out"
                        variant="outlined"
                        sx={{
                          backgroundColor: "#F44336",
                          color: "#FFFFFF",
                          borderColor: "#F44336",
                          "&:hover": { backgroundColor: "#D32F2F" },
                        }}
                        onClick={handleCheckOut}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>{/* Add any additional actions here */}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography sx={{ mt: 2, fontSize: "1.25rem", fontWeight: "bold" }}>
            Booker
          </Typography>
          {/* Add form fields to edit the reservation */}
          <TextField
            fullWidth
            label="Full Name"
            defaultValue={reservation.guestname}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            defaultValue={reservation.booker.email}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            defaultValue={reservation.booker.phonenum}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Country"
            defaultValue={reservation.booker.country}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            label="Special Instructions"
            defaultValue={reservation.special_request}
            sx={{ mt: 2 }}
          />
          {/* <Button variant="contained" sx={{ mt: 2 }} onClick={handleClose}>
            Save
          </Button> */}
        </Paper>
        <img
          src="/guestFooter.png"
          alt="Guest Footer"
          style={{
            width: "100.9%",
            marginTop: "-0.5rem",
            marginLeft: "-.25rem",
          }}
        />
      </Box>
    </Modal>
  );
};

export default EditReservationModal;
