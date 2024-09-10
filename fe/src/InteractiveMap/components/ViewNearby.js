import React, { useRef } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import PropertyCard from "./PropertyCard"; // Import PropertyCard
import TopRated from "./TopRated";

const ViewNearby = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const places = [
    {
      name: "Bubble Siargao",
      image: "/bubblesiargao.jpg",
      rating: "9.3 Exceptional",
      reviews: 71,
      location: "General Luna, Siargao Island",
      originalPrice: "₱4,154",
      discountedPrice: "₱3,636",
    },
    {
      name: "Bubble Siargao",
      image: "/bubblesiargao.jpg",
      rating: "9.3 Exceptional",
      reviews: 71,
      location: "General Luna, Siargao Island",
      originalPrice: "₱4,154",
      discountedPrice: "₱3,636",
    },
    {
      name: "Bubble Siargao",
      image: "/bubblesiargao.jpg",
      rating: "9.3 Exceptional",
      reviews: 71,
      location: "General Luna, Siargao Island",
      originalPrice: "₱4,154",
      discountedPrice: "₱3,636",
    },
    {
      name: "Bubble Siargao",
      image: "/bubblesiargao.jpg",
      rating: "9.3 Exceptional",
      reviews: 71,
      location: "General Luna, Siargao Island",
      originalPrice: "₱4,154",
      discountedPrice: "₱3,636",
    },
    {
      name: "Bubble Siargao",
      image: "/bubblesiargao.jpg",
      rating: "9.3 Exceptional",
      reviews: 71,
      location: "General Luna, Siargao Island",
      originalPrice: "₱4,154",
      discountedPrice: "₱3,636",
    },
  ];

  return (
    <Card sx={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
      <TopRated />
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", fontSize: "1.2", mb: 2 }}
        >
          Get inspired by our top-rated
        </Typography>
        <Box
          sx={{ display: "flex", alignItems: "center", position: "relative" }}
        >
          {/* Left Arrow Button */}
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: "absolute",
              left: 0,
              zIndex: 2,
              backgroundColor: "#f0f0f0",
              borderRadius: "50%",
              boxShadow: 2,
              height: "40px",
              width: "40px",
              top: "50%",
              transform: "translateY(-50%)", // Center the button vertically
            }}
          >
            <ArrowLeft />
          </IconButton>

          {/* Scrollable Property Cards */}
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              whiteSpace: "nowrap",
              gap: 2, // Space between cards
              px: 2, // Horizontal padding
              flex: 1,
              alignItems: "center", // Center cards vertically
              scrollbarWidth: "none", // Hide scrollbar
              msOverflowStyle: "none", // Hide scrollbar for Internet Explorer and Edge
              "&::-webkit-scrollbar": {
                display: "none", // Hide scrollbar for WebKit browsers
              },
            }}
          >
            {places.map((place, index) => (
              <Box
                key={index}
                sx={{
                  flexShrink: 0, // Prevent cards from shrinking
                  width: 250, // Fixed width for cards
                }}
              >
                <PropertyCard places={[place]} />
              </Box>
            ))}
          </Box>

          {/* Right Arrow Button */}
          <IconButton
            onClick={scrollRight}
            sx={{
              position: "absolute",
              right: 0,
              zIndex: 2,
              backgroundColor: "#f0f0f0",
              borderRadius: "50%",
              boxShadow: 2,
              height: "40px",
              width: "40px",
              top: "50%",
              transform: "translateY(-50%)", // Center the button vertically
            }}
          >
            <ArrowRight />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ViewNearby;
