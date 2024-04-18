import React, { useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

const styles = {
  heading: {
    textTransform: "none", // Ensure heading text is in lowercase
    margin: 0, // Remove default margin
  },
  paragraph: {
    textTransform: "none", // Ensure paragraph text is in lowercase
    margin: 0, // Remove default margin
    marginLeft: "20px", // Add left margin for separation
  },
};

export default function BasicButtons() {
  const [clickedButton, setClickedButton] = useState(null);

  const handleClick = (button) => {
    if (clickedButton === button) {
      // If the clicked button is the same as the currently clicked button, toggle off
      setClickedButton(null);
    } else {
      // If a different button is clicked, set it as the clicked button
      setClickedButton(button);
    }
  };

  return (
    <Box
    // sx={{
    //   height: "100vh",
    // }}
    >
      <Container
        maxWidth="lg"
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Center horizontally
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "left", paddingBottom: "20px" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            {" "}
            Unlock the door to hosting with CebuStay!
            <br />
            List your property and open your doors to guests effortlessly!
          </Typography>
          <Typography sx={{ fontSize: 18, mb: 2 }}>
            Ready to dive in? Kickstart your hosting journey by selecting the
            perfect property type to list on CebuStay?
          </Typography>
          {/* <h3>
            Unlock the door to hosting with CebuStay!
            <br />
            List your property and open your doors to guests effortlessly!
          </h3> */}
          {/* <p style={{ fontSize: "18px" }}>
            Ready to dive in? Kickstart your hosting journey by selecting the
            perfect property type to list on CebuStay?
          </p> */}
        </div>

        <Paper
          elevation={3}
          sx={{
            boxShadow: "none", // Remove box shadow
          }}
        >
          <Box width={800} mb={2}>
            {/* Add margin bottom for padding */}
            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  clickedButton === "Apartment" ? "#1780CB" : "white",
                color: clickedButton === "Apartment" ? "white" : "black",
                fontFamily: "Poppins, sans-serif",
                width: 800,
                height: 80,
                pt: 5,
                pb: 5,
                "&:hover": {
                  backgroundColor: "#16B4DD",
                  color: "white",
                  // "& img": {
                  //   filter: "invert(100%)",
                  // },
                },
              }}
              startIcon={
                <img
                  src="apartment.png"
                  alt="Apartment"
                  style={{
                    marginRight: "10px",
                    width: "60px",
                    height: "60px",
                  }}
                />
              }
              onClick={() => handleClick("Apartment")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: 18,
                    m: 2,
                    textTransform: "none",
                  }}
                >
                  Apartment
                </Typography>
                <span>&nbsp;</span>
                <p
                  style={{
                    ...styles.paragraph,
                    textAlign: "left",
                    fontSize: "16px",
                  }}
                >
                  Self-contained unit within a building, typically offering one
                  or more bedrooms, a bathroom, a kitchen, and a living area.
                </p>
              </div>
            </Button>
          </Box>
          <Box width={800} mb={2}>
            {" "}
            {/* Add margin bottom for padding */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: clickedButton === "Home" ? "#1780CB" : "white",
                color: clickedButton === "Home" ? "white" : "black",
                fontFamily: "Poppins, sans-serif",
                width: 800,
                height: 80,
                "&:hover": {
                  backgroundColor: "#16B4DD",
                  color: "white",
                  // "& img": {
                  //   filter: "invert(100%)",
                  // },
                },
              }}
              startIcon={
                <img
                  src="home.png"
                  alt="Home"
                  style={{
                    marginRight: "10px",
                    width: "60px",
                    height: "60px",
                  }}
                />
              }
              onClick={() => handleClick("Home")}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 18,
                  m: 2,
                  textTransform: "none",
                }}
              >
                Home
              </Typography>
              <span>&nbsp;</span>
              <p
                style={{
                  ...styles.paragraph,
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                Private residential property offering multiple rooms, including
                bedrooms, bathrooms, a kitchen, and living spaces.
              </p>
            </Button>
          </Box>
          <Box width={800} mb={2}>
            {" "}
            {/* Add margin bottom for padding */}
            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  clickedButton === "Hotel" ? "#1780CB" : "white",
                color: clickedButton === "Hotel" ? "white" : "black",
                fontFamily: "Poppins, sans-serif",
                width: 800,
                height: 80,
                "&:hover": {
                  backgroundColor: "#16B4DD",
                  color: "white",
                  // "& img": {
                  //   filter: "invert(100%)",
                  // },
                },
              }}
              startIcon={
                <img
                  src="hotel.png"
                  alt="Hotel"
                  style={{
                    marginRight: "10px",
                    width: "60px",
                    height: "60px",
                  }}
                />
              }
              onClick={() => handleClick("Hotel")}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 18,
                  m: 2,
                  textTransform: "none",
                }}
              >
                Hotel
              </Typography>
              <span>&nbsp;</span>
              <p
                style={{
                  ...styles.paragraph,
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                Commercial establishment offering various types of
                accommodations, amenities such as room service, housekeeping
                etc.
              </p>
            </Button>
          </Box>
          <Box width={800} mb={2}>
            {" "}
            {/* Add margin bottom for padding */}
            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  clickedButton === "Others" ? "#1780CB" : "white",
                color: clickedButton === "Others" ? "white" : "black",
                fontFamily: "Poppins, sans-serif",

                height: 80,
                "&:hover": {
                  backgroundColor: "#16B4DD",
                  color: "white",
                  // "& img": {
                  //   filter: "invert(100%)",
                  // },
                },
              }}
              startIcon={
                <img
                  src="others.png"
                  alt="Others"
                  style={{
                    marginRight: "10px",
                    width: "60px",
                    height: "60px",
                  }}
                />
              }
              onClick={() => handleClick("Others")}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 18,
                  m: 2,
                  textTransform: "none",
                }}
              >
                Others
              </Typography>
              <span>&nbsp;</span>
              <p
                style={{
                  ...styles.paragraph,
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                Diverse accommodations beyond traditional options, such as
                vacation rentals, cottages, or other unique properties.
              </p>
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
