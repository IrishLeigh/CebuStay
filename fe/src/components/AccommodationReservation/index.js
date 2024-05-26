import React, { useState } from "react";
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
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import Sidebar from "../Sidebar";
import EditReservationModal from "./modals/guests";

const AccommodationReservation = () => {
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Sample data for the table
  const reservations = [
    {
      id: "1",
      guestDetails: {
        fullname: "John Doe",
        gender: "Male",
        birthdate: "1990-05-15",
        phonenumber: "09123456789",
      },
      property: "Ocean View Villa",
      stayDate: "2023-06-15 to 2023-06-20",
      price: "$1500",
      payment: "Paid",
      status: "Check-in",
      actionNeeded: "None",
      unit: "Villa A",
      numberOfGuests: 4,
    },
    {
      id: "2",
      guestDetails: {
        fullname: "Jane Smith",
        gender: "Female",
        birthdate: "1985-10-20",
        phonenumber: "09987654321",
      },
      property: "Mountain Retreat",
      stayDate: "2023-07-10 to 2023-07-15",
      price: "$1000",
      payment: "Pending",
      status: "Check-out",
      actionNeeded: "Review",
      unit: "Cabin B",
      numberOfGuests: 2,
    },
    // Add more reservations as needed
  ];

  const handleOpen = (reservation) => {
    setSelectedReservation(reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Container>
          <TableContainer component={Paper}>
            <Table aria-label="reservations table">
              <TableHead>
                <TableRow>
                  <TableCell>Guest Details</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Stay Date</TableCell>
                  <TableCell>No. of Guests</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div>
                        <div>{reservation.guestDetails.fullname}</div>
                        <div>{reservation.guestDetails.gender}</div>
                        <div>{reservation.guestDetails.birthdate}</div>
                        <div>{reservation.guestDetails.phonenumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>{reservation.property}</TableCell>
                    <TableCell>{reservation.unit}</TableCell>
                    <TableCell>{reservation.stayDate}</TableCell>
                    <TableCell>{reservation.numberOfGuests}</TableCell>
                    <TableCell>{reservation.price}</TableCell>
                    <TableCell>{reservation.payment}</TableCell>
                    <TableCell>{reservation.status}</TableCell>
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

          <EditReservationModal
            open={open}
            handleClose={handleClose}
            reservation={selectedReservation}
          />
        </Container>
      </div>
    </div>
  );
};

export default AccommodationReservation;
