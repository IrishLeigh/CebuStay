import React, { useState } from "react";
import { Button, Typography, Grid, Container } from "@mui/material";
import { motion } from "framer-motion";

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

function AmenityButton({ icon, text, isSelected, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

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
          backgroundColor: isSelected ? "#1780CB" : "white",
          color: isSelected ? "white" : "black",
          fontFamily: "Poppins, sans-serif",
          width: 200,
          height: 80,
          "&:hover": {
            backgroundColor:
              isHovered && !isSelected
                ? "#16B4DD"
                : isSelected
                ? "#1780CB"
                : "white",
            color:
              isHovered && !isSelected
                ? "white"
                : isSelected
                ? "white"
                : "black",
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
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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

function CategorySection({ category, label, onItemsChange }) {
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const toggleItemSelection = (itemText) => {
    if (selectedAmenities.includes(itemText)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== itemText));
    } else {
      setSelectedAmenities([...selectedAmenities, itemText]);
    }
    onItemsChange(category, selectedAmenities); // Notify parent component about the updated selected items
  };

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
              <AmenityButton
                icon={item.icon}
                text={item.text}
                isSelected={selectedAmenities.includes(item.text)}
                onClick={() => toggleItemSelection(item.text)}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}

function AccommodationPropertyInformation({ onAmenitiesChange }) {
  const [selectedAmenities, setSelectedAmenities] = useState({
    basicAmenities: [],
    basicServices: [],
    facilities: [],
  });

  const handleItemsChange = (category, items) => {
    setSelectedAmenities((prevSelectedAmenities) => ({
      ...prevSelectedAmenities,
      [category]: items,
    }));
    onAmenitiesChange(category, items); // Notify parent component about the updated selected items
  };
  
  

  return (
    <>
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "left",
          marginTop: "5rem",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "2rem" }}>
          Property Information
        </Typography>
        <Typography sx={{ fontSize: "1.5rem", mb: 2 }}>
          Please click the buttons you choose.
        </Typography>
        <CategorySection
          category="basicAmenities"
          label={"Basic Amenities"}
          onItemsChange={handleItemsChange}
        />
        <CategorySection
          category="basicServices"
          label={"Basic Services"}
          onItemsChange={handleItemsChange}
        />
        <CategorySection
          category="facilities"
          label={"Facilities"}
          onItemsChange={handleItemsChange}
        />
        {/* Display selected items for each category */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          Selected Amenities:
        </Typography>
        <Typography variant="body1">
          Basic Amenities: {selectedAmenities.basicAmenities.join(", ")}
        </Typography>
        <Typography variant="body1">
          Basic Services: {selectedAmenities.basicServices.join(", ")}
        </Typography>
        <Typography variant="body1">
          Facilities: {selectedAmenities.facilities.join(", ")}
        </Typography>
      </Container>
    </>
  );
}

export default AccommodationPropertyInformation;
