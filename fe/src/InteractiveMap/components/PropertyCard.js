import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  ButtonBase,
  useMediaQuery,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const PropertyCard = ({ places = [], onClick }) => {
  // Determine screen size
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Check if the places array is valid
  if (!Array.isArray(places) || places.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        No places available
      </Typography>
    );
  }

  // Display the first place if available
  const place = places[0];

  return (
    <ButtonBase
      onClick={onClick}
      sx={{ display: "block", textAlign: "left", width: "100%" }}
    >
      <Card
        sx={{
          maxWidth: isSmallScreen ? "100%" : 250,
          borderRadius: 3,
          margin: "0 auto",
        }}
      >
        <CardMedia
          component="img"
          height={isSmallScreen ? "50" : "100"} // Smaller height for responsiveness
          image={place.image}
          alt={place.name}
          sx={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: isSmallScreen ? "100%" : 250,
          }}
        />
        <CardContent sx={{ padding: isSmallScreen ? "0.5rem" : "1rem" }}>
          {/* Property Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: isSmallScreen ? "1rem" : "1.125rem",
              fontFamily: "Poppins",
            }}
          >
            {place.name}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{
                fontWeight: "bold",
                fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                fontFamily: "Poppins",
              }}
            >
              {place.rating}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: "#555",
                fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                fontFamily: "Poppins",
              }}
            >
              {place.reviews} reviews
            </Typography>
          </Box>

          {/* Location */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
            }}
          >
            <LocationOnIcon
              fontSize="small"
              color="action"
              sx={{
                fontSize: isSmallScreen ? "0.75rem" : "1rem",
                color: "#16B4DD",
              }}
            />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginLeft: "0.5rem", fontFamily: "Poppins" }}
            >
              {place.location}
            </Typography>
          </Box>

          {/* Pricing */}
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "#a1a1a1",
                fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
                fontFamily: "Poppins",
              }}
            >
              {place.originalPrice}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "red",
                fontWeight: "bold",
                fontSize: isSmallScreen ? "1rem" : "1.25rem",
                fontFamily: "Poppins",
              }}
            >
              {place.discountedPrice}
            </Typography>
          </Box>

          {/* Additional Info */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              fontSize: isSmallScreen ? "0.65rem" : "0.75rem",
              fontFamily: "Poppins",
            }}
          >
            Per night before taxes and fees
            <br />
            (2 adults)
          </Typography>
        </CardContent>
      </Card>
    </ButtonBase>
  );
};

// Define prop types
PropertyCard.propTypes = {
  places: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      rating: PropTypes.string.isRequired,
      reviews: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      originalPrice: PropTypes.string.isRequired,
      discountedPrice: PropTypes.string.isRequired,
    })
  ),
  onClick: PropTypes.func, // Add the onClick prop for handling clicks
};

export default PropertyCard;
