import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ViewNearby from "./ViewNearby";
import useMediaQuery from "@mui/material/useMediaQuery"; // Import useMediaQuery hook
import * as turf from "@turf/turf";
import IconButton from "@mui/material/IconButton"; // Import IconButton
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon

const CultureCard = ({ culture, allProperties, onClose }) => {
  // Accept onClose as a prop
  const [showNearby, setShowNearby] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)"); // Define breakpoint for small screens

  const myLocation = () => {
    const [latitude, longitude] = culture.coordinates; // Extract latitude and longitude from culture.coordinates
    console.log("Using culture's coordinates:", latitude, longitude);
    findNearbyLocations([latitude, longitude]);
  };

  const findNearbyLocations = (userLocation) => {
    const userPoint = turf.point(userLocation);

    const nearby = allProperties
      .map((loc) => {
        const locPoint = turf.point(loc.coordinates);
        const distance = turf.distance(userPoint, locPoint, {
          units: "kilometers",
        });
        return { ...loc, distance };
      })
      .filter((loc) => loc.distance <= 5) // Only include locations within 5 km
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, 5); // Take the nearest 5 locations

    console.log("Nearby locations:", nearby);
  };

  const handleViewNearbyButton = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setShowNearby(true);
  };

  const handleGoBack = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setShowNearby(false); // To go back to the original CultureCard view
  };

  return (
    <div>
      {showNearby ? (
        <div style={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute", // Position it absolutely
              top: 0, // Adjust as needed to position vertically
              right: "1rem", // Align it to the right
              zIndex: 10, // Ensure it’s on top of other elements
            }}
          >
            <IconButton onClick={handleGoBack}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <ViewNearby />
          {/* Pass handleGoBack to ViewNearby */}
        </div>
      ) : (
        <Card
          sx={{
            maxWidth: isSmallScreen ? "100%" : 400,
            margin: "1rem",
            boxShadow: 3,
            position: "relative", // Add relative positioning for the card
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute", // Position it absolutely
              top: 0, // Adjust as needed to position vertically
              right: ".5rem", // Align it to the right
              zIndex: 10, // Ensure it’s on top of other elements
            }}
          >
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <CardMedia
            component="img"
            alt={culture.name}
            height={isSmallScreen ? "150" : "200"} // Responsive height
            image={culture.imageUrl}
            title={culture.name}
          />
          <CardContent sx={{ padding: isSmallScreen ? "0.5rem" : "1rem" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ fontSize: isSmallScreen ? "1.2rem" : "1.5rem" }}
            >
              {culture.name.toUpperCase()}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
            >
              {culture.description}
            </Typography>
            <Typography
              variant="h6"
              sx={{ mt: 2, fontSize: isSmallScreen ? "1rem" : "1.25rem" }}
            >
              What to Wear:
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
            >
              {culture.description2}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleViewNearbyButton}
              >
                View Nearby
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CultureCard;
