import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTheme, useMediaQuery } from "@mui/material";

const TopRated = ({ onClose, onCardClick }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:425px)"); // Check if screen is 425px or less

  const hotel = {
    name: "Luxury Beach Resort",
    imageUrl: "/Sumilon.jpg",
    rating: 4.5,
    reviewCount: 651,
    address: "123 Ocean Drive, Paradise City, Island Nation",
    price: 8000,
    facilities: ["Swimming Pool", "Spa", "Gym"],
  };

  // Specific colors for each facility
  const facilityColors = {
    "Swimming Pool": "#16B4DD",
    Spa: "#ADC939",
    Gym: "#F9CC41",
  };

  // Styles
  const styles = {
    card: {
      maxWidth: isSmallScreen ? "100%" : 400,
      margin: "0 auto",
      boxShadow: 3,
      cursor: "pointer", // Make the card clickable
    },
    header: {
      backgroundColor: "#EE414B",
      color: "white",
      padding: "0.5rem",
      textAlign: "left",
      height: isSmallScreen ? "2rem" : "2.5rem",
    },
    headerText: {
      fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
      fontWeight: "bold",
      fontFamily: "Poppins",
    },
    media: {
      width: isSmallScreen ? "100%" : 250,
      height: isSmallScreen ? "150px" : "250px", // Adjust height for small screens
    },
    content: {
      flex: 1,
      padding: "0.5rem",
    },
    title: {
      fontSize: isSmallScreen ? "1rem" : "1.125rem",
      fontFamily: "Poppins",
    },
    reviewCount: {
      fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
      fontFamily: "Poppins",
    },
    address: {
      fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
      fontFamily: "Poppins",
      marginLeft: "0.5rem",
    },
    description: {
      fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
      fontFamily: "Poppins",
      margin: "0.5rem 0",
    },
    facilityBox: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
    },
    facility: {
      borderRadius: "0.5rem",
      padding: "0.5rem 1rem",
      color: "white",
      textAlign: "center",
    },
    priceBox: {
      marginLeft: "auto",
      backgroundColor: "#EE414B",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
    },
    priceLabel: {
      fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
      fontFamily: "Poppins",
    },
    starIcon: {
      color: "#FFD700",
      fontSize: isSmallScreen ? "1rem" : "1.125rem",
    },
    locationIcon: {
      color: "#16B4DD",
      fontSize: isSmallScreen ? "0.75rem" : "1rem",
    },
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <Box display="flex" alignItems="center">
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon key={index} sx={styles.starIcon} />
        ))}
        {halfStars === 1 && <StarIcon sx={styles.starIcon} />}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorderIcon key={index} sx={styles.starIcon} />
        ))}
      </Box>
    );
  };

  return (
    <Card
      sx={styles.card}
      onClick={onCardClick} // Handle card click
    >
      <Box sx={styles.header}>
        <Typography component="div" sx={styles.headerText}>
          Top Reviewed
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >
        <CardMedia
          component="img"
          alt={hotel.name}
          sx={styles.media}
          image={hotel.imageUrl}
          title={hotel.name}
        />
        <CardContent sx={styles.content}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={0.5}
          >
            <Typography sx={styles.title}>{hotel.name}</Typography>
            <Typography sx={styles.reviewCount}>
              {hotel.reviewCount} reviews
            </Typography>
          </Box>
          {renderStars(hotel.rating)}
          <Box display="flex" alignItems="center" mt={0.5}>
            <LocationOnIcon sx={styles.locationIcon} />
            <Typography sx={styles.address}>{hotel.address}</Typography>
          </Box>
          <Typography sx={styles.description}>This property offers:</Typography>
          <Box sx={styles.facilityBox}>
            {hotel.facilities.map((facility, index) => (
              <Box
                key={index}
                sx={{
                  ...styles.facility,
                  backgroundColor: facilityColors[facility] || "#EEEEEE",
                }}
              >
                <Typography
                  sx={{
                    fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
                    fontFamily: "Poppins",
                  }}
                >
                  {facility}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            mt={-10}
          >
            <Typography sx={styles.priceLabel}>Price per night</Typography>
            <Box sx={styles.priceBox}>
              <Typography
                sx={{
                  fontSize: isSmallScreen ? "0.75rem" : "1rem",
                  fontFamily: "Poppins",
                }}
              >
                ₱ {hotel.price.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default TopRated;
