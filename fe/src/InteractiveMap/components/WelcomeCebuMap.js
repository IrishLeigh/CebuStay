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
        width: "100%",
        height: "auto",
        mx: "auto", // Center horizontally

        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Black background with 33% opacity
      }}
    >
      <CardContent>
        <Typography
          sx={{
            textAlign: "center",
            color: "#F9CC41",
            fontWeight: "bold",
            fontSize: isSmallScreen
              ? "0.5rem"
              : {
                  xs: "1rem", // Default font size for smaller screens
                  sm: "1rem", // Font size for medium screens
                  md: "2.5rem", // Larger font size for bigger screens
                  "@media (orientation: landscape)": "1.2rem", // Adjust font size in landscape mode
                },
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
            fontSize: isSmallScreen
              ? "0.5rem"
              : {
                  xs: "1rem", // Default font size for smaller screens
                  sm: "0.9rem", // Font size for medium screens
                  md: "1.5rem", // Larger font size for bigger screens
                  "@media (orientation: landscape)": "1.2rem", // Adjust font size in landscape mode
                },
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
