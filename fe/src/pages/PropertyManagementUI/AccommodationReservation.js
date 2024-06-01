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
  Button
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import Sidebar from "../../components/Sidebar";
import EditReservationModal from "./modals/EditReservationModal";
import axios from "axios";
import Checkouts from "./components/checkout"; // Assuming you have this component
import Cancelled from "./components/cancelled"; // Assuming you have this component
import CheckedIn from "./components/checkedin";
import Upcoming from "./components/upcoming"; // Assuming you have this component


const AccommodationReservation = () => {
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [checkOut, setCheckOut] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState("all"); // New state variable

  // Token
  // useEffect(() => {
  //   const token = localStorage.getItem("auth_token");
  //   if (token) {
  //     axios
  //       .post("http://127.0.0.1:8000/api/decodetoken", { token })
  //       .then((response) => {
  //         setUser(response.data["data"]);
  //       })
  //       .catch((error) => {
  //         alert("Error decoding JWT token:", error);
  //         setUser(null);
  //       });
  //   } else {
  //     setUser(null);
  //   }
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
          console.log("RESPONSE DATA: ", response.data["data"]);
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  // Get the bookings
  useEffect(() => {


    const fetchData = async () => {
      if (!user) return; 
      try {
        const propertyres = await axios.get(
          "http://127.0.0.1:8000/api/property/bookings",
          {
            params: {
              userid: user.userid,
            },
          }
        );
        setPropertyData(propertyres.data);
        setCheckIns(propertyres.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user]);

  // Get the checkouts
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const propertyres = await axios.get(
          "http://127.0.0.1:8000/api/allbookinghistory",
          {
            params: {
              userid: 6,
            },
          }
        );
        setCheckOut(propertyres.data);
        console.log("Checkout", propertyres.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user]);

  const handleOpen = (reservation) => {
    setSelectedReservation(reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  const filteredData = propertyData.filter((reservation) => {
    if (activeComponent === "all") return true;
    return reservation.status.toLowerCase() === activeComponent;
  });

  const renderComponent = () => {
    switch (activeComponent) {
      case "all":
        return (
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
                    <TableCell sx={{ fontSize: "1rem" }}>{reservation.type === "booking" ? "Checked-in" : "Upcoming"}</TableCell>
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
        );
      case "checked in":
        return <CheckedIn data={checkIns} />;
      case "checked out":
        return <Checkouts data={checkOut} />;
      case "cancelled":
        return <Cancelled data={filteredData} />;
      case "upcoming":
        return <Upcoming data={filteredData} />;
      default:
        return null;
    }
  };

  return (
    <Grid container>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <Grid
        item
        xs={10}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "5%",
            marginRight: "5%",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              justifyContent: "center",
              textAlign: "left",
              mt: 2,
              ml: 4,
              pb: 2,
            }}
          >
            Property Reservations
          </Typography>
          <Container
            sx={{
              justifyContent: "center",
              textAlign: "left",
              m: 1,
            }}
          >
            <Stack direction="row" spacing={2} mb={2}>
              <Button
                variant="contained"
                onClick={() => setActiveComponent("all")}
                sx={{
                  backgroundColor: "white",
                  color: "blue",
                  border: "1px solid blue",
                  borderRadius: "0.5rem",
                  '&:hover': {
                    backgroundColor: "lightblue",
                  }
                }}
              >
                All
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveComponent("checked in")}
                sx={{
                  backgroundColor: "white",
                  color: "blue",
                  border: "1px solid blue",
                  borderRadius: "0.5rem",
                  '&:hover': {
                    backgroundColor: "lightblue",
                  }
                }}
              >
                Checked In
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveComponent("checked out")}
                sx={{
                  backgroundColor: "white",
                  color: "blue",
                  border: "1px solid blue",
                  borderRadius: "0.5rem",
                  '&:hover':{
                    backgroundColor: "lightblue",
                  }
                }}
              >
                Checked Out
              </Button>

              <Button
                variant="contained"
                onClick={() => setActiveComponent("cancelled")}
                sx={{
                  backgroundColor: "white",
                  color: "blue",
                  border: "1px solid blue",
                  borderRadius: "0.5rem",
                  '&:hover': {
                    backgroundColor: "lightblue",
                  }
                }}
              >
                Cancelled
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveComponent("upcoming")}
                sx={{
                  backgroundColor: "white",
                  color: "blue",
                  border: "1px solid blue",
                  borderRadius: "0.5rem",
                  '&:hover': {
                    backgroundColor: "lightblue",
                  }
                }}
              >
                Upcoming
              </Button>
            </Stack>
            <Paper p={2}>
              {renderComponent()}
            </Paper>

            <EditReservationModal
              open={open}
              handleClose={handleClose}
              reservation={selectedReservation}
            />
          </Container>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AccommodationReservation;