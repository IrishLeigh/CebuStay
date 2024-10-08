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
  const [showNearby, setShowNearby] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)"); // Define breakpoint for small screens
  const isMediumScreen = useMediaQuery("(max-width:768px)"); // Define for medium screens

  const [nearbyLocations, setNearbyLocations] = useState([]);

  const myLocation = () => {
    const [latitude, longitude] = culture.coordinates; // Extract latitude and longitude from culture.coordinates
    findNearbyLocations([latitude, longitude]);
  };

  const findNearbyLocations = (userLocation) => {
    if (!allProperties.length) return; // No filtered locations
    const userPoint = turf.point(userLocation);

    const nearby = allProperties
      .map((loc) => {
        const { coordinates } = loc;
        if (
          !coordinates ||
          coordinates[0] === null ||
          coordinates[1] === null
        ) {
          return null; // Skip this location
        }

        const locPoint = turf.point(coordinates);
        const distance = turf.distance(userPoint, locPoint, {
          units: "kilometers",
        });
        return { ...loc, distance };
      })
      .filter((loc) => loc !== null && loc.distance <= 20) // Only include valid locations within 20 km
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, 5); // Take the nearest 5 locations

    setNearbyLocations(nearby);
  };

  const handleViewNearbyButton = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    myLocation();
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
              position: "absolute",
              top: 0,
              right: "1rem",
              zIndex: 10,
            }}
          >
            <IconButton onClick={handleGoBack}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ViewNearby nearbyLocations={nearbyLocations} />
        </div>
      ) : (
        <Card
          sx={{
            width: isSmallScreen ? "100vw" : 400,
            height: isSmallScreen ? "auto" : "500",
            // margin: isSmallScreen ? "1rem auto" : "1rem", // Center horizontally on small screens
            boxShadow: 3,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignSelf: isSmallScreen ? "center" : "flex-start", // Center on small screens
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute",
              top: 0,
              right: ".5rem",
              zIndex: 10,
            }}
          >
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <CardMedia
            component="img"
            alt={culture.name}
            height={isSmallScreen ? "60%" : "200"} // Responsive height
            image={culture.imageUrl}
            title={culture.name}
            sx={{
              objectFit: "cover", // Ensure image covers the space
              width: isSmallScreen ? "100%" : "auto", // Make sure it takes full width on small screens
              height: isSmallScreen ? "30%" : "200", // Adjust height for small screens
            }}
          />
          <CardContent
            sx={{ padding: isSmallScreen ? "0.5rem" : "1rem", flexGrow: 1 }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ fontSize: isSmallScreen ? "1.5rem" : "1rem" }}
            >
              {culture.name.toUpperCase()}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isSmallScreen ? "1rem" : "0.9rem" }}
            >
              {culture.description}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#16B4DD",
                  color: "white",
                  fontSize: isSmallScreen
                    ? "0.8rem"
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

export default CultureCard;
