import React, { useState }  from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { List, ListItem, ListItemText } from "@mui/material";
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
    setShowNearby(false); // To go back to the original CultureCard view
  };

  return (
    <>
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
            alt={spot.name}
            height="200"
            image={spot.imageUrl}
            title={spot.name}
            cityName={spot.cityName}
          />
          <CardContent>
          <Typography gutterBottom variant="body1" component="div">
              {spot.cityName}
            </Typography>
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
              <Button variant="contained" color="primary" onClick={handleViewNearbyButton} >
                View Nearby
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  )

}
 


export default SeeAndDoCard;
