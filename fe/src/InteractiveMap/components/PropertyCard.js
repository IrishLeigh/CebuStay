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
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ nearbyLocation, onClick }) => {
  // Determine screen size
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  // Check if the places array is valid
  if (!Array.isArray(nearbyLocation) || nearbyLocation.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        No places available
      </Typography>
    );
  }

  // Display the first place if available
  const place = nearbyLocation[0];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Full stars
    const hasHalfStar = rating % 1 >= 0.5; // Check for half star

    // Create full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="">★</span>);
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(<span key="half" className="">☆</span>);
    }

    // Fill remaining with empty stars up to 5
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={`empty-${i}`} className="">☆</span>);
    }

    return stars;
  };
  const handleView = (e, propertyid) => {
    // Construct query params
    const queryParams = new URLSearchParams({
      guestCapacity: '', // Default to empty string if null
      checkin_date: '', // Default to empty string if null
      checkout_date: '', // Default to empty string if null
    }).toString();

    console.log("Query Params:", queryParams);
  
    // Navigate to the property page with query parameters
    navigate(`/accommodation/property/${propertyid}?${queryParams}`);
  };

  return (
    <ButtonBase
      onClick={handleView}
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
          image={place.propertyFiles?.[0]?.src || "/propertyplaceholder.jpg"}
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
              {place.rating ? (
                <>
                  {renderStars(place.rating)}

                </>
              ) : (
                "No rating yet"
              )}
            </Typography>
            {/* <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: "#555",
                fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                fontFamily: "Poppins",
              }}
            >
              {place.reviews} reviews 
            </Typography> */}
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
              sx={{ marginLeft: "0.5rem", fontFamily: "Poppins", textOverflow: 'ellipsis', whiteSpace: 'wrap', overflow: 'auto',  }}
            >
              {place.address}
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
              ₱ {place.pricing?.min_price?.toLocaleString()}
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
            ({place.guestCapacity} Guests)
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
