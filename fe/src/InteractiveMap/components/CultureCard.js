import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as turf from "@turf/turf";
import Box from "@mui/material/Box";
import ViewNearby from "./ViewNearby";

const CultureCard = ({ culture, allProperties }) => {
  const [showNearby, setShowNearby] = useState(false);

  console.log("Culture:", culture);
  const myLocation = () => {
    const [latitude, longitude] = culture.coordinates; // Extract latitude and longitude from culture.coordinates
    console.log("Using culture's coordinates:", latitude, longitude);
    findNearbyLocations([latitude, longitude]);
  };

  const findNearbyLocations = (userLocation) => {
    // if (!filteredLocations.length) return; // No filtered locations
    const userPoint = turf.point(userLocation);

    console.log("User's filteredLocations:", culture);
    // Calculate distances and filter locations within 5 km


    // Create an array to represent nearby locations, using the culture data
    const nearby = allProperties
    .map((loc) => {
      const locPoint = turf.point(loc.coordinates);
      console.log("locPoint:", locPoint);
      const distance = turf.distance(userPoint, locPoint, { units: 'kilometers' });
      return { ...loc, distance };
    })
    .filter((loc) => loc.distance <= 5) // Only include locations within 5 km
    .sort((a, b) => a.distance - b.distance) // Sort by distance
    .slice(0, 5); // Take the nearest 5 locations
    
    console.log("Nearby locations:", nearby);
    // setSelectedCategory(null);
    // setNearbyLocations(nearby);
  };

  myLocation();

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
        <div>
          <ViewNearby />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={handleGoBack}>
              Back
            </Button>
          </Box>
        </div>
      ) : (
        <Card sx={{ maxWidth: 400, margin: "0 auto", boxShadow: 3 }}>
          <CardMedia
            component="img"
            alt={culture.name}
            height="200"
            image={culture.imageUrl}
            title={culture.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {culture.name.toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {culture.description}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              What to Wear:
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
