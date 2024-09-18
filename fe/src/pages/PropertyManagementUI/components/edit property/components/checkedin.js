import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import EditReservationModal from "../../../modals/EditReservationModal";

const CheckedIn = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleOpen = (data) => {
    setSelectedReservation(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  // Filter the data to only include reservations of type "Booking"
  const filteredData = data.filter((item) => item.type === "booking");
console.log("DATA INSIDE CHECKED IN", filteredData);
  return (
    <div>
      <Paper p={2}>
        <TableContainer
          component={Paper}
          sx={{ width: "100%", boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.5)" }}
        >
          <Table aria-label="datas table" sx={{ minWidth: 600 }}>
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
              {filteredData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell sx={{ fontSize: "1rem" }}>
                    <div>
                      <div>{data.guestname}</div>
                      <div>Booking id: #{data.bhid}</div>
                      <div>{data.booker.phonenum}</div>
                    </div>
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{data.property_name}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{data.property_type}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>
                    {data.checkin_date} to {data.checkout_date}
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{data.guest_count}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{data.total_price}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{data.payment}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{data.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(data)}>
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

export default CheckedIn;
