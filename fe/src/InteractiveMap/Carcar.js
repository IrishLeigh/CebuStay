import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function CarCar() {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardMedia
        component="img"
        alt="Carcar City Cebu"
        height="200"
        image="/carcarlechon.jpg"
        title="Carcar City Cebu"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          CARCAR CITY CEBU
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          3rd week of January
        </Typography> */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Carcar is famous for its lechon, considered one of the best in the
          Philippines. The public market is a must-visit for food lovers, where
          you can taste freshly roasted lechon with crispy skin and tender meat.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          What to Wear:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          For the Rosquillos Festival, wear light and comfortable clothing like
          a sundress or t-shirt with shorts, paired with comfortable shoes, a
          hat, and sunglasses to stay cool and stylish in the warm weather.
        </Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary">
            View Nearby Stay
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
