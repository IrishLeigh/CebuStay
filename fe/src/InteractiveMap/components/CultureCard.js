import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ViewNearby from "./ViewNearby";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as turf from "@turf/turf";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CultureCard = ({ culture, allProperties, onClose }) => {
  const [showNearby, setShowNearby] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:768px)");

  const [nearbyLocations, setNearbyLocations] = useState([]);

  const myLocation = () => {
    const [latitude, longitude] = culture.coordinates;
    findNearbyLocations([latitude, longitude]);
  };

  const findNearbyLocations = (userLocation) => {
    if (!allProperties.length) return;
    const userPoint = turf.point(userLocation);

    const nearby = allProperties
      .map((loc) => {
        const { coordinates } = loc;
        if (
          !coordinates ||
          coordinates[0] === null ||
          coordinates[1] === null
        ) {
          return null;
        }

        const locPoint = turf.point(coordinates);
        const distance = turf.distance(userPoint, locPoint, {
          units: "kilometers",
        });
        return { ...loc, distance };
      })
      .filter((loc) => loc !== null && loc.distance <= 20)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    setNearbyLocations(nearby);
  };

  const handleViewNearbyButton = (event) => {
    event.preventDefault();
    event.stopPropagation();
    myLocation();
    setShowNearby(true);
  };

  const handleGoBack = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowNearby(false);
  };

  const preventCloseOnCardClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div>
      {showNearby ? (
        <div style={{ position: "relative" }} onClick={preventCloseOnCardClick}>
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
            width: isSmallScreen ? "100%" : "100%",
            height: "auto", // Adjust height based on content
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
            height={isSmallScreen ? "60%" : "50%"}
            image={culture.imageUrl}
            title={culture.name}
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
            }}
          >
            <Typography
              gutterBottom
              component="div"
              sx={{
                fontSize: isSmallScreen ? "0.5rem" : "1.5rem",
                fontWeight: "bold",
                overflowWrap: "break-word", // Break long words to prevent overflow
              }}
            >
              {culture.name.toUpperCase()}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: isSmallScreen ? "0.5rem" : "1rem",
                overflowWrap: "break-word", // Ensure text wraps properly
              }}
            >
              {culture.description}
            </Typography>
            <Box
              sx={{ margin: "auto", display: "flex", justifyContent: "center" }}
            >
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

export default CultureCard;
