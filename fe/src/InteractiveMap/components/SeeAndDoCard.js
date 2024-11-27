import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import * as turf from "@turf/turf";
import { List, ListItem, ListItemText } from "@mui/material";
import IconButton from "@mui/material/IconButton"; // Import IconButton
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon
import ViewNearby from "./ViewNearby";
import useMediaQuery from "@mui/material/useMediaQuery"; // Import useMediaQuery hook

const SeeAndDoCard = ({ spot, allProperties, onClose }) => {
  const moreInfo = Array.isArray(spot.more_info) ? spot.more_info : [];
  const [showNearby, setShowNearby] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width:600px)"); // Define breakpoint for small screens
  const isMediumScreen = useMediaQuery("(max-width:768px)"); // Define for medium screens
  const isLargeScreen = useMediaQuery("(max-width:1440px)"); // Define for large screens

  const handleViewNearbyButton = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation(); // Prevent event from bubbling up
    }
    myLocation();
    setShowNearby(true);
  };

  const myLocation = () => {
    const [latitude, longitude] = spot.coordinates; // Extract latitude and longitude from culture.coordinates
    console.log("Using spot's coordinates:", latitude, longitude);
    findNearbyLocations([latitude, longitude]);
  };
  const preventCloseOnCardClick = (event) => {
    event.stopPropagation();
  };

  const findNearbyLocations = (userLocation) => {
    if (!allProperties.length) return; // No filtered locations
    const userPoint = turf.point(userLocation);
    console.log("User's filteredLocations:", allProperties);

    // Calculate distances and filter locations within 5 km
    const nearby = allProperties
      .map((loc) => {
        // Check if coordinates are valid (not null)
        const { coordinates } = loc;
        if (
          !coordinates ||
          coordinates[0] === null ||
          coordinates[1] === null
        ) {
          return null; // Skip this location
        }

        const locPoint = turf.point(coordinates);
        console.log("locPoint:", locPoint);
        const distance = turf.distance(userPoint, locPoint, {
          units: "kilometers",
        });
        return { ...loc, distance };
      })
      .filter((loc) => loc !== null && loc.distance <= 20) // Only include valid locations within 20 km
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, 5); // Take the nearest 5 locations

    setNearbyLocations(nearby);
    console.log("Nearby locations:", nearby);
  };

  const handleGoBack = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation(); // Prevent event from bubbling up
    }
    setShowNearby(false); // To go back to the original SeeAndDoCard view
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
          <ViewNearby nearbyLocations={nearbyLocations} />
        </div>
      ) : (
        <Card
          sx={{
            width: isSmallScreen ? "100%" : "100%",
            height: isLargeScreen ? "70vh" : "50vh", // Adjust height based on content
            boxShadow: 3,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignSelf: isSmallScreen ? "center" : "flex-start",
            pointerEvents: showNearby ? "none" : "auto", // Disable interaction when showNearby is true
          }}
          onClick={preventCloseOnCardClick} // Prevent close when clicking inside the card
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
            alt={spot.name}
            height={isSmallScreen ? "60%" : "50%"}
            image={spot.imageUrl}
            title={spot.name}
            sx={{
              objectFit: "cover",
              width: isSmallScreen ? "100%" : "auto",
              height: isSmallScreen ? "30%" : "200px",
            }}
          />

          <CardContent
            sx={{
              padding: isSmallScreen ? "0.5rem" : "1rem",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // Space out content evenly
              overflowY: "auto",
            }}
          >
            {" "}
            {/* Flex grow to allow content to expand */}
            <Typography
              gutterBottom
              component="div"
              sx={{
                fontSize: isSmallScreen ? "0.5rem" : "1.5rem",
                fontWeight: "bold",
                overflowWrap: "break-word", // Break long words to prevent overflow
              }}
            >
              {spot.name.toUpperCase()}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isSmallScreen ? "0.9rem" : "1rem" }}
            >
              {spot.description}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isSmallScreen ? "0.9rem" : "1rem" }}
            >
              {spot.activities}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              More Info:
            </Typography>
            <List sx={{ padding: 0 }}>
              {moreInfo.map((info, index) => (
                <ListItem key={index}>
                  <ListItemText primary={info} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#16B4DD",
                  color: "white",
                  fontSize: isSmallScreen
                    ? "0.5rem"
                    : isMediumScreen
                    ? "0.8rem"
                    : "1rem",
                  padding: isSmallScreen
                    ? "0.4rem 1rem"
                    : isMediumScreen
                    ? "0.4rem 1rem"
                    : "0.4rem 1rem",
                }}
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

export default SeeAndDoCard;
