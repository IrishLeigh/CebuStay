import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Paper,
  IconButton,
  Grid,
  Typography,
  Box,
  Stack,
  Chip,
  Button
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import EditReservationModal from "../modals/guests";

const Cancelled = () => {
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [propertyData, setPropertyData] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");

  


  const handleOpen = (reservation) => {
    setSelectedReservation(reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  const filteredData = propertyData.filter((reservation) => {
    if (filter === "all") return true;
    return reservation.status.toLowerCase() === filter;
  });

  return (
    <div>
            <Paper p={2}>
              <TableContainer
                component={Paper}
                sx={{ width: "100%", boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)" }}
              >
                <Table aria-label="reservations table" sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        Guest Details
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        Property
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        Unit
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        Stay Date
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        No. of Guests
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        Price
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        Payment
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell sx={{ fontSize: "1rem" }}>
                          <div>
                            <div>{reservation.guestname}</div>
                            <div>Booking id: #{reservation.bookingid}</div>
                            <div>{reservation.booker.phonenum}</div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>{reservation.property_name}</TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>{reservation.property_type}</TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>
                          {reservation.checkin_date} to {reservation.checkout_date}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>{reservation.guest_count}</TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>{reservation.total_price}</TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>{reservation.status}</TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>{reservation.type == "booking" ? "Checked-in"  : "Upcoming"}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpen(reservation)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <EditReservationModal
              open={open}
              handleClose={handleClose}
              reservation={selectedReservation}
            />
    </div>
  );
};

export default Cancelled;
