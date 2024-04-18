import { useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const styles = {
  heading: {
    textTransform: "none", // Ensure heading text is in lowercase
    margin: 0, // Remove default margin
  },
  paragraph: {
    textTransform: "none", // Ensure paragraph text is in lowercase
    margin: 0, // Remove default margin
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
    <Box>
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            textAlign: "left",
            marginLeft: "20px",
          }}
        >
          Property Type
        </Typography>
        <Typography
          sx={{ fontSize: 18, mb: 2, textAlign: "left", marginLeft: "20px" }}
        >
          What can guests book?
        </Typography>
        <Box
          flexDirection="column"
          alignItems="center"
          boxShadow={4}
          p={4}
          borderRadius={4}
          width={800}
        >
          <Box mb={5}>
            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  clickedButton === "EntirePlace" ? "#16B4DD" : "white",
                color: clickedButton === "EntirePlace" ? "white" : "black",
                fontFamily: "Poppins, sans-serif",
                height: 100,
                pt: 5,
                pb: 5,
                "&:hover": {
                  backgroundColor: "#16B4DD",
                  color: "white",
                  "& img": {
                    filter: "invert(100%)",
                  },
                },
              }}
              startIcon={
                <img
                  src="rooms.png"
                  alt="Rooms"
                  style={{
                    marginLeft: "20px",
                    width: "60px",
                    height: "60px",
                  }}
                />
              }
              onClick={() => handleClick("EntirePlace")}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 18,
                  m: 2,
                  textTransform: "none",
                }}
              >
                Entire Place
              </Typography>
              <span>&nbsp;</span>
              <p
                style={{
                  ...styles.paragraph,
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                Guests are able to use the entire place and do not have to share
                this with the host or other guests.
              </p>
            </Button>
          </Box>
          <Box width={800} mb={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor:
                  clickedButton === "PrivateRoom" ? "#16B4DD" : "white",
                color: clickedButton === "PrivateRoom" ? "white" : "black",
                fontFamily: "Poppins, sans-serif",
                width: 800,
                height: 100,
                "&:hover": {
                  backgroundColor: "#16B4DD",
                  color: "white",
                  "& img": {
                    filter: "invert(100%)",
                  },
                },
              }}
              startIcon={
                <img
                  src="rooms.png"
                  alt="Rooms"
                  style={{
                    marginLeft: "20px",
                    width: "60px",
                    height: "60px",
                  }}
                />
              }
              onClick={() => handleClick("PrivateRoom")}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 18,
                  m: 2,
                  textTransform: "none",
                }}
              >
                Private Room
              </Typography>
              <span>&nbsp;</span>
              <p
                style={{
                  ...styles.paragraph,
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                Guests rent a room within the property. There are common areas
                that are either shared with the host or other guests.
              </p>
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
