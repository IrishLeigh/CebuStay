import React, { useState, useEffect, useCallback } from "react";
import { Button, Typography, Grid, Container, Card, CardContent, Paper, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useRef } from "react";

// Sample data
const data = {
  basicAmenities: [
    { icon: "/toiletries.png", text: "Toiletries" },
    { icon: "/aircon.png", text: "Air Conditioning" },
    { icon: "/wifi.png", text: "Wi-Fi" },
    { icon: "/minibar.png", text: "Mini Bar" },
    { icon: "/workspace.png", text: "Workspace" },
    { icon: "/tv.png", text: "Television" },
    { icon: "/refrigerator.png", text: "Refrigerator" },
    { icon: "/microwave.png", text: "Microwave" },
  ],
  basicServices: [
    { icon: "/housekeeping.png", text: "House Keeping" },
    { icon: "/breakfast.png", text: "Breakfast" },
    { icon: "/shuttle.png", text: "Shuttle Service" },
    { icon: "/carrental.png", text: "Car Rental" },
    { icon: "/frontdesk.png", text: "24hours Front Desk" },
    { icon: "/concierge.png", text: "Concierge" },
    { icon: "/laundry.png", text: "Laundry" },
    { icon: "/petfriendly.png", text: "Pet Friendly" },
    { icon: "/roomservice.png", text: "Room Service" },
    { icon: "/cleaningservice.png", text: "Cleaning Service" },
    { icon: "/wakeupcall.png", text: "Wake-up Call Service" },
  ],
  facilities: [
    { icon: "/swimmingpool.png", text: "Swimming Pool" },
    { icon: "/gym.png", text: "Gym" },
    { icon: "/wellness.png", text: "Wellness Facilities" },
    { icon: "/gameroom.png", text: "Game Room" },
    { icon: "/sports.png", text: "Sports Facilities" },
    { icon: "/parking.png", text: "Parking" },
    { icon: "/businesscenter.png", text: "Business Center" },
    { icon: "/businesscenter.png", text: "Club House" },
    { icon: "/restaurant.png", text: "Restaurant" },
    { icon: "/cafe.png", text: "Cafe" },
    { icon: "/bar.png", text: "Bar" },
    { icon: "/lounge.png", text: "Lounge Area" },
  ],
};

const AmenityButton = React.memo(({ icon, text, isSelected, onClick }) => {
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
          opacity: 100,
          "&:hover": {
            backgroundColor: isHovered && !isSelected ? "#16B4DD" : isSelected ? "#1780CB" : "white",
            color: isHovered && !isSelected ? "white" : isSelected ? "white" : "black",
          },
          margin: "0.5rem",
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
        <Typography sx={{ fontWeight: "bold", fontSize: 18, textTransform: "none" }}>
          {text}
        </Typography>
      </Button>
    </Container>
  );
});

const CategorySection = React.memo(({ category, label, onItemsChange, initialSelectedItems }) => {
  const [selectedAmenities, setSelectedAmenities] = useState(initialSelectedItems || []);

  const toggleItemSelection = (itemText) => {
    const newSelectedAmenities = selectedAmenities.includes(itemText)
      ? selectedAmenities.filter((item) => item !== itemText)
      : [...selectedAmenities, itemText];

    setSelectedAmenities(newSelectedAmenities);
    onItemsChange(category, newSelectedAmenities);
  };

  return (
    <Paper sx={{ 
      marginBottom: 2, 
      p: "1rem", 
      borderRadius: "0.8rem", 
      backgroundColor: "rgba(255, 255, 255, 0.8)" // Adjust this color and opacity as needed
    }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "left", pl: 4 }}>
        {label}
      </Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid container spacing={2} sx={{ maxWidth: 800 }}>
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
    </Paper>
  );
});


const AmenitiesFacilitiesServices = ({ onAmenitiesChange, parentAmenities, handleNext, handleBack }) => {
  const [selectedAmenities, setSelectedAmenities] = useState({
    basicAmenities: parentAmenities.basicAmenities || [],
    basicServices: parentAmenities.basicServices || [],
    facilities: parentAmenities.facilities || [],
  });
  
  const topRef = useRef(null); // Create a ref for scrolling to the top
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); 

  useEffect(() => {
    window.scrollTo(0, 0);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the top of the component
    }
  }, []); // Runs on mount

  const handleItemsChange = useCallback((category, items) => {
    setSelectedAmenities((prev) => ({
      ...prev,
      [category]: items,
    }));
    onAmenitiesChange(category, items);
  }, [onAmenitiesChange]);

  const handleSave = () => {
    const isAnySelected = Object.values(selectedAmenities).some(category => category.length > 0);
    
    if (!isAnySelected) {
      setSnackbarMessage("Please select at least one amenity, service, or facility.");
      setSnackbarOpen(true);
      return; // Prevent proceeding if no amenities are selected
    }

    console.log("Selected Amenities from child:", selectedAmenities);
    onAmenitiesChange(selectedAmenities);
    handleNext();
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div ref={topRef}>
      <Container
        maxWidth="md"
       className="centered-container"
      >
        <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: 2, fontFamily: "Poppins, sans-serif" }}>
          Customize Your Stay
        </Typography>
        <Typography sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}>
          Please select the amenities, services, and facilities you would like to include for your property:
        </Typography>
        <CategorySection
          category="basicAmenities"
          label="Basic Amenities"
          onItemsChange={handleItemsChange}
          initialSelectedItems={selectedAmenities.basicAmenities}
        />
        <CategorySection
          category="basicServices"
          label="Basic Services"
          onItemsChange={handleItemsChange}
          initialSelectedItems={selectedAmenities.basicServices}
        />
        <CategorySection
          category="facilities"
          label="Facilities"
          onItemsChange={handleItemsChange}
          initialSelectedItems={selectedAmenities.facilities}
        />
        <div className="stepperFooter" style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          <Button onClick={handleBack} className="stepperPrevious" sx={{ marginRight: 1 }}>
            Back
          </Button>
          <Button onClick={handleSave} className="stepperNext">
            Next
          </Button>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default AmenitiesFacilitiesServices;
