import React from "react";
import PropTypes from "prop-types";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const PropertyCard = ({ places = [] }) => {
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
    <Card sx={{ maxWidth: 250, borderRadius: 3 }}>
      <CardMedia
        component="img"
        height="150"
        image={place.image}
        alt={place.name}
        sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      />
      <CardContent>
        {/* Property Name */}
        <Typography variant="h6" component="div">
          {place.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            variant="body2"
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            {place.rating}
          </Typography>
          <Typography variant="body2" sx={{ ml: 1, color: "#555" }}>
            {place.reviews} reviews
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="textSecondary">
            {place.location}
          </Typography>
        </Box>

        {/* Pricing */}
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textDecoration: "line-through", color: "#a1a1a1" }}
          >
            {place.originalPrice}
          </Typography>
          <Typography variant="h5" sx={{ color: "red", fontWeight: "bold" }}>
            {place.discountedPrice}
          </Typography>
        </Box>

        {/* Additional Info */}
        <Typography variant="caption" color="textSecondary">
          Per night before taxes and fees
          <br />
          (2 adults)
        </Typography>
      </CardContent>
    </Card>
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
};

export default PropertyCard;
