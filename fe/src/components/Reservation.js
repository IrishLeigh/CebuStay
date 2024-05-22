import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import BalconyIcon from "@mui/icons-material/Balcony";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import ShowerIcon from "@mui/icons-material/Shower";

export default function ReservationForm() {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const roomData = {
    imageUrl: "image1.png",
    benefits: ["Free Wi-Fi", "Parking", "Breakfast"],
    guests: 2,
    pricePerNight: "$100",
    booked: 5,
    amenities: [
      { name: "Garden View", icon: <LocalFloristIcon /> },
      { name: "Balcony", icon: <BalconyIcon /> },
      { name: "Non-Smoking", icon: <SmokingRoomsIcon /> },
      { name: "Shower", icon: <ShowerIcon /> },
    ],
  };

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  return (
    <Container
      maxWidth="xl"
      style={{ backgroundColor: "#F4F7FA", padding: "20px" }}
    >
      <Paper
        elevation={0}
        style={{
          textAlign: "left",
          padding: "10px",
          backgroundColor: "#F4F7FA",
          marginBottom: "20px",
        }}
      >
        <Typography
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          Select Your Room
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        style={{
          textAlign: "left",
          padding: "20px",
          boxShadow: "0 0 0 1px #D4CFCF",
          marginBottom: "20px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <img
              src={roomData.imageUrl}
              alt="Placeholder"
              style={{
                width: "100%",
                height: "auto",
                cursor: "pointer",
              }}
              onClick={handleImageClick}
            />
            <div style={{ marginTop: "20px" }}>
              {roomData.amenities.map((amenity) => (
                <div
                  key={amenity.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  {amenity.icon}
                  <span style={{ marginLeft: "10px" }}>{amenity.name}</span>
                </div>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={8}>
            <div style={{ border: "1px solid #D4CFCF", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Benefits</th>
                    <th>Guests</th>
                    <th>Price/Night</th>
                    <th>Booked</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span
                        style={{
                          fontSize: "1rem",
                          fontFamily: "Poppins",
                        }}
                      >
                        Your Price Includes:
                        <br />
                        {roomData.benefits.map((benefit) => (
                          <span key={benefit}>
                            {benefit}
                            <br />
                          </span>
                        ))}
                      </span>
                    </td>
                    <td>{roomData.guests} Guests</td>
                    <td>{roomData.pricePerNight}</td>
                    <td>{roomData.booked}</td>
                    <td>
                      <Button variant="contained" color="primary">
                        Book Now
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </Paper>

      {isImageOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setIsImageOpen(false)}
        >
          <img
            src={roomData.imageUrl}
            alt="Placeholder"
            style={{ maxWidth: "80%", maxHeight: "80%", cursor: "pointer" }}
          />
        </div>
      )}
    </Container>
  );
}
