import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function WelcomeCebuMap() {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Card
      sx={{
        width: isSmallScreen ? "320px" : "100%", // Width adjusts based on screen size
        height: isSmallScreen ? "auto" : "60vh", // Height is auto for small screens
        maxHeight: isSmallScreen ? "50vh" : "none", // Limit height for small screens
        mx: "auto", // Center horizontally
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Black background with 33% opacity
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          component="div"
          sx={{
            textAlign: "center",
            color: "#F9CC41",
            fontWeight: "bold",
            fontSize: isSmallScreen ? "1.5rem" : "2rem", // Adjust font size
          }}
        >
          Welcome to Cebu Map!
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: "center",
            color: "#FFD700",
            mb: 2,
            fontSize: isSmallScreen ? "1rem" : "1.25rem", // Adjust font size
          }}
        >
          How to navigate the map
        </Typography>

        {/* Direct Image Insertion */}
        <img
          src="/WelcomeCebuMap.png" // Replace with the actual path to your image
          alt="Cebu Map"
          style={{
            width: "100%", // Full width of the container
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
        />
      </CardContent>
    </Card>
  );
}
