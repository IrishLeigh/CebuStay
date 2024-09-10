import React, { useRef } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import PropertyCard from "./PropertyCard"; // Import PropertyCard

const MainCard = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -250,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 250,
        behavior: "smooth",
      });
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
      name: "Another Place",
      image: "/anotherplace.jpg",
      rating: "8.7 Very Good",
      reviews: 45,
      location: "Some Location",
      originalPrice: "₱5,000",
      discountedPrice: "₱4,500",
    },
    {
      name: "Another Place",
      image: "/anotherplace.jpg",
      rating: "8.7 Very Good",
      reviews: 45,
      location: "Some Location",
      originalPrice: "₱5,000",
      discountedPrice: "₱4,500",
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
    // Add more places if needed
  ];

  return (
    <Card sx={{ maxWidth: 600, margin: "0 auto", boxShadow: 3 }}>
      <CardContent>
        {/* <Divider sx={{ width: "100%", color: "#ccc", margin: "20px 0" }} /> */}
        {/* Render PropertyCard components with scroll arrows */}
        <Typography variant="h5" component="div">
          Get inspired by our top-rated
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
          <IconButton onClick={scrollLeft} sx={{ mr: 1 }}>
            <ArrowLeft />
          </IconButton>
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              whiteSpace: "nowrap",
              gap: 2,
              padding: "0 8px",
              flex: 1,
            }}
          >
            {places.map((place, index) => (
              <Box key={index} sx={{ display: "inline-block", minWidth: 250 }}>
                <PropertyCard places={[place]} />
              </Box>
            ))}
          </Box>
          <IconButton onClick={scrollRight} sx={{ ml: 1 }}>
            <ArrowRight />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MainCard;
