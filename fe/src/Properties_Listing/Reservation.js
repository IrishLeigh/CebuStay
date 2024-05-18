import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

export default function ReservationForm() {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [roomData, setRoomData] = useState({
    imageUrl: "image1.png",
    benefits: ["Free Wi-Fi", "Parking", "Breakfast"],
    guests: 2,
    pricePerNight: "$100",
    booked: 5,
    amenities: [
      { name: "Garden View", icon: "🌷" },
      { name: "Balcony", icon: "🌇" },
      { name: "Swimming Pool", icon: "🏊" },
    ],
  });

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const [hovered, setHovered] = useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const amenities = {
    "Basic Amenities": [
      { name: "Toiletries", icon: "🧴" },
      { name: "Air conditioning", icon: "❄️" },
      { name: "Free Wi-Fi", icon: "📶" },
      { name: "Minibar", icon: "🍷" },
      { name: "Workspace", icon: "💼" },
      { name: "Television", icon: "📺" },
      { name: "Refrigerator", icon: "🍔" },
      { name: "Microwave", icon: "🍴" },
    ],
    "Basic Services": [
      { name: "Housekeeping", icon: "🧹" },
      { name: "Breakfast", icon: "🍳" },
      { name: "Shuttle Service", icon: "🚐" },
      { name: "Car Rental", icon: "🚗" },
      { name: "Front Desk", icon: "🛎️" },
      { name: "Concierge", icon: "🎩" },
      { name: "Laundry Service", icon: "👕" },
      { name: "Pet Friendly", icon: "🐾" },
      { name: "Room Service", icon: "🍽️" },
      { name: "Cleaning Service", icon: "🧼" },
      { name: "Wake-up Call", icon: "⏰" },
    ],
    "Basic Facilities": [
      { name: "Swimming Pool", icon: "🏊" },
      { name: "Gym", icon: "🏋️" },
      { name: "Wellness Center", icon: "💆" },
      { name: "Game Room", icon: "🎮" },
      { name: "Sports Facilities", icon: "⚽" },
      { name: "Parking", icon: "🅿️" },
      { name: "Business Center", icon: "💼" },
    ],
  };

  const propertyPolicies = {
    smoking_allowed: true,
    pets_allowed: false,
    parties_events_allowed: true,
    noise_restrictions: "No loud noises after 10 PM",
    quiet_hours_start: "22:00",
    quiet_hours_end: "07:00",
    custom_rules: ["No shoes inside the house.", "Keep the kitchen clean."],
    check_in_from: "14:00",
    check_in_until: "22:00",
    check_out_from: "08:00",
    check_out_until: "11:00",
  };

  return (
    <Container maxWidth="xl">
      {/* Select Your Room */}
      <Paper
        elevation={0}
        style={{
          textAlign: "left",
          padding: "10px",
          backgroundColor: "#F4F7FA",
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

      {/* Room Details */}
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
            {/* Room Image */}
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
              {/* Room Amenities */}
              {roomData.amenities.map((amenity) => (
                <div
                  key={amenity.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  {amenity.icon} {/* Amenity Icon */}
                  <span style={{ marginLeft: "10px" }}>
                    {amenity.name}
                  </span>{" "}
                  {/* Amenity Name */}
                </div>
              ))}
              {/* See All Amenities Tooltip */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                      onMouseEnter={handleHover}
                      onMouseLeave={handleLeave}
                    >
                      <Tooltip title="See All Amenities" arrow>
                        <Button
                          variant="outlined"
                          style={{
                            borderRadius: "50%", // Make the button circular
                            width: "50px", // Set width to create a smaller circle
                            height: "50px", // Set height to create a smaller circle
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 0,
                          }}
                        >
                          <AddIcon />
                        </Button>
                      </Tooltip>
                      {hovered && (
                        <div
                          style={{
                            position: "absolute",
                            left: "calc(100% + 10px)",
                            transform: "translateY(50%)",
                            backgroundColor: "#fff",
                            padding: "40px",
                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                            zIndex: 10,
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "50px",
                            border: "1px solid #ddd",
                            bottom: "100%",
                          }}
                        >
                          {/* Display All Amenities */}
                          {Object.entries(amenities).map(
                            ([category, items]) => (
                              <div key={category}>
                                {/* Amenity Category */}
                                <Typography
                                  variant="subtitle1"
                                  gutterBottom
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  <strong>{category}</strong>
                                </Typography>
                                <ul
                                  style={{ listStyleType: "none", padding: 0 }}
                                >
                                  {/* Individual Amenities */}
                                  {items.map((item, index) => (
                                    <li
                                      key={index}
                                      style={{ marginBottom: "5px" }}
                                    >
                                      {item.icon} {item.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
          {/* Room Details Table */}
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
                      <span style={{ fontSize: "1rem", fontFamily: "Poppins" }}>
                        Your Price Includes:
                        <br />
                        {roomData.benefits.map((benefit, index) => (
                          <span key={index}>
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

      {/* Room Image Modal */}
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

      {/* Additional Paper Component for Property Policies */}
      <Paper
        elevation={0}
        style={{
          textAlign: "left",
          padding: "20px",
          boxShadow: "0 0 0 1px #D4CFCF",
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
          Property Policies
        </Typography>
        {/* Display Property Policies */}
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {Object.entries(propertyPolicies).map(([policyKey, policyValue]) => (
            <li key={policyKey}>
              <strong>{policyKey.replace(/_/g, " ")}</strong>:{" "}
              {typeof policyValue === "boolean"
                ? policyValue
                  ? "Yes"
                  : "No"
                : policyValue}
            </li>
          ))}
        </ul>
      </Paper>
    </Container>
  );
}
