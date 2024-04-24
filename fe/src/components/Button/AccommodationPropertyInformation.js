import React from "react";
import { Button, Box, Typography, Grid, Container } from "@mui/material"; // Import necessary MUI components
import { motion } from "framer-motion"; // Import motion for animation

const data = {
  basicAmenities: [
    { icon: "toiletries.png", text: "Toiletries" },
    { icon: "aircon.png", text: "Air Conditioning" },
    { icon: "wifi.png", text: "Wi-Fi" },
    { icon: "minibar.png", text: "Mini Bar" },
    { icon: "workspace.png", text: "Workspace" },
    { icon: "tv.png", text: "Television" },
    { icon: "refrigerator.png", text: "Refrigerator" },
    { icon: "microwave.png", text: "Microwave" },
  ],
  basicServices: [
    { icon: "housekeeping.png", text: "House Keeping" },
    { icon: "breakfast.png", text: "Breakfast" },
    { icon: "shuttle.png", text: "Shuttle Service" },
    { icon: "carrental.png", text: "Car Rental" },
    { icon: "frontdesk.png", text: "24hours Front Desk" },
    { icon: "concierge.png", text: "Concierge" },
    { icon: "laundry.png", text: "Laundry" },
    { icon: "petfriendly.png", text: "Pet Friendly" },
    { icon: "roomservice.png", text: "Room Service" },
    { icon: "cleaningservice.png", text: "Cleaning Service" },
    { icon: "wakeupcall.png", text: "Wake-up Call Service" },
  ],
  facilities: [
    { icon: "swimmingpool.png", text: "Swimming Pool" },
    { icon: "gym.png", text: "Gym" },
    { icon: "wellness.png", text: "Wellness Facilities" },
    { icon: "gameroom.png", text: "Game Room" },
    { icon: "sports.png", text: "Sports Facilities" },
    { icon: "parking.png", text: "Parking" },
    { icon: "businesscenter.png", text: "Business Center" },
  ],
};

function AmenityButton({ icon, text }) {
  return (
    <Container
      maxWidth="lg"
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "1rem",
      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: "white",
          color: "black",
          fontFamily: "Poppins, sans-serif",
          width: 200,
          height: 80,
          "&:hover": {
            backgroundColor: "#16B4DD",
            color: "white",
            "& img": {
              filter: "invert(100%)",
            },
          },
        }}
        startIcon={
          <motion.img
            src={icon}
            alt={text}
            style={{ width: "50px", height: "50px" }}
            whileHover={{ scale: 1.2 }}
          />
        }
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: 18,
              textTransform: "none",
            }}
          >
            {text}
          </Typography>
          <span>&nbsp;</span>
        </div>
      </Button>
    </Container>
  );
}

function CategorySection({ category, label }) {
  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mx: { xs: 2, sm: 10, md: 20 },
          my: 2,
          textAlign: "left",
        }}
      >
        {label}
      </Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid container spacing={1} sx={{ maxWidth: 800 }}>
          {data[category].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AmenityButton icon={item.icon} text={item.text} />
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}

function AccommodationPropertyInformation() {
  return (
    <>
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Center horizontally
          textAlign: "left",
          height: "100vh",
          marginTop: "28rem",
          ml: "",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "2rem" }}>
          Property Information
        </Typography>
        <Typography sx={{ fontSize: "1.5rem", mb: 2 }}>
          Please click the button you choose.
        </Typography>
        <CategorySection category="basicAmenities" label={"Basic Amenities"} />
        <CategorySection category="basicServices" label={"Basic Services"} />
        <CategorySection category="facilities" label={"Facilities"} />
      </Container>
    </>
  );
}

export default AccommodationPropertyInformation;
