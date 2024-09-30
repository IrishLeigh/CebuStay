import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { List, ListItem, ListItemText } from "@mui/material";
import IconButton from "@mui/material/IconButton"; // Import IconButton
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon
import ViewNearby from "./ViewNearby";

const SeeAndDoCard = ({ spot, onClose }) => {
  const moreInfo = Array.isArray(spot.more_info) ? spot.more_info : [];
  const [showNearby, setShowNearby] = useState(false);

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
          <ViewNearby />
        </div>
      ) : (
        <Card
          sx={{
            maxWidth: 400,
            margin: "1 rem",
            boxShadow: 3,
            position: "relative",
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
              {/* Adjust color as needed */}
            </IconButton>
          </Box>
          <CardMedia
            component="img"
            alt={spot.name}
            height="200"
            image={spot.imageUrl}
            title={spot.name}
          />

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {spot.name.toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {spot.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {spot.activities}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              More Info:
            </Typography>
            <List>
              {moreInfo.map((info, index) => (
                <ListItem key={index}>
                  <ListItemText primary={info} />
                </ListItem>
              ))}
            </List>

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

export default SeeAndDoCard;
