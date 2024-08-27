import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function BadianKawasanFalls() {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardMedia
        component="img"
        alt="Badian Kawasan Falls"
        height="200"
        image="/BadianKawasanFalls.jpg"
        title="Badian Kawasan Falls"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          KAWASAN FALLS
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          3rd week of January
        </Typography> */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          The Kawasan Falls is a three-stage cascade of clear turquoise water
          from mountain springs located in the jungles of the Cebu island. The
          falls are part of the Kawasan River in Badian, Cebu, in the
          Philippines.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          What to Wear:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
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
