import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const CultureCard = ({ culture, onClose }) => (
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
        <Button variant="contained" color="primary" onClick={onClose}>
          View Nearby
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default CultureCard;
