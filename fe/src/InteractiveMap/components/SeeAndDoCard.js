import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { List, ListItem, ListItemText } from "@mui/material";

const SeeAndDoCard = ({ spot, onClose }) => {
  const moreInfo = Array.isArray(spot.more_info) ? spot.more_info : [];

  return (
    
    <Card sx={{ maxWidth: 400, margin: "0 auto", boxShadow: 3 }}>
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
          <Button variant="contained" color="primary" onClick={onClose}>
            View Nearby
          </Button>
        </Box>
      </CardContent>
    </Card>
  )

}
 


export default SeeAndDoCard;
