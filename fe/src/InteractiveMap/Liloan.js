import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Liloan() {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardMedia
        component="img"
        alt="Rosquillos Festival"
        height="200"
        image="/liloanfestival.jpg"
        title="Rosquillos Festival"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          ROSQUILLOS FESTIVAL
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          3rd week of January
        </Typography> */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          The Rosquillos Festival is a cultural and food festival celebrated in
          Liloan, Cebu, Philippines. It is held in honor of the town’s most
          famous delicacy, the "rosquillos," a type of circular cookie made from
          flour, eggs, sugar, shortening, and baking powder. These cookies were
          first made by Margarita “Titay” Frasco in 1907, and they have since
          become a beloved local treat.
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
