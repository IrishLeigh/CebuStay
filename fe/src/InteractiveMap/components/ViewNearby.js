import React, { useRef } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import PropertyCard from "./PropertyCard";
import TopRated from "./TopRated";

const ViewNearby = ({ nearbyLocations, onCardClick }) => {
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

  return (
    <Card
      sx={{
        maxWidth: "100%",
        margin: "1rem",
        position: "relative",
      }}
    >
      {nearbyLocations.length > 0 ? (
        <>
          <TopRated nearbyLocations={[nearbyLocations]} />
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold", fontSize: "1.2", mb: 2 }}
            >
              Get inspired by our top-rated
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  scrollLeft();
                }}
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
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowLeft />
              </IconButton>

              <Box
                ref={scrollRef}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  gap: 2,
                  px: 2,
                  flex: 1,
                  alignItems: "center",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {nearbyLocations.map((nearbyLocation, index) => (
                  <Box
                    key={index}
                    sx={{
                      flexShrink: 0,
                      width: 250,
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation
                      console.log("Card clicked", nearbyLocation);
                      if (onCardClick) onCardClick(nearbyLocation); // Trigger a custom click handler
                    }}
                  >
                    <PropertyCard nearbyLocation={[nearbyLocation]} />
                  </Box>
                ))}
              </Box>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  scrollRight();
                }}
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
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowRight />
              </IconButton>
            </Box>
          </CardContent>
        </>
      ) : (
        <CardContent>
          <Typography variant="h5">No Nearby Properties Found</Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default ViewNearby;
