import React, { useRef } from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import PropertyCard from "./PropertyCard"; // Import PropertyCard
import TopRated from "./TopRated";
import { useNavigate } from "react-router-dom";

const ViewNearby = ({ nearbyLocations }) => {
  const scrollRef = useRef(null);
  console.log("Nearby Locations:", nearbyLocations);
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

  const navigate = useNavigate();

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
            {nearbyLocations.length > 0 ? (
              <>
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
                    {nearbyLocations.map((nearbyLocation, index) => (
                      <Box
                        key={index}
                        sx={{
                          flexShrink: 0,
                          width: 250,
                          cursor: "pointer", // Change cursor to indicate clickability
                        }}
                      >
                        <PropertyCard nearbyLocation={[nearbyLocation]} />
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
              </>
            ) : (
              <>
                <Typography variant="h5">No Nearby Properties Found</Typography>
              </>
            )}
          </CardContent>
        </>
      ) : (
        <>
          <CardContent>
            <Typography variant="h5">No Nearby Properties Found</Typography>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ViewNearby;
