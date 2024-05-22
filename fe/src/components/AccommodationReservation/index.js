import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Paper,
  Checkbox,
} from "@mui/material";
import Sidebar from "../Sidebar";

const AccommodationReservation = () => {
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
      status: "Confirmed",
      actionNeeded: "None",
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
      status: "Pending",
      actionNeeded: "Review",
    },
    // Add more reservations as needed
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Container>
          <TableContainer component={Paper}>
            <Table aria-label="reservations table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Guest Details</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Stay Date</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action Needed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{reservation.guestDetails.fullname}</div>
                        <div>{reservation.guestDetails.gender}</div>
                        <div>{reservation.guestDetails.birthdate}</div>
                        <div>{reservation.guestDetails.phonenumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>{reservation.property}</TableCell>
                    <TableCell>{reservation.stayDate}</TableCell>
                    <TableCell>{reservation.price}</TableCell>
                    <TableCell>{reservation.status}</TableCell>
                    <TableCell>{reservation.actionNeeded}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
    </div>
  );
};

export default AccommodationReservation;
