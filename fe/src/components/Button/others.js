import * as React from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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
  const [selectedButtons, setSelectedButtons] = React.useState([]);

  const handleButtonClick = (button) => {
    if (selectedButtons.includes(button)) {
      setSelectedButtons(selectedButtons.filter((btn) => btn !== button));
    } else {
      setSelectedButtons([...selectedButtons, button]);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          textAlign: "left",
          marginLeft: "20px",
        }}
      >
        Property Type
      </Typography>
      <Typography
        sx={{ fontSize: 18, mb: 2, textAlign: "left", marginLeft: "20px" }}
      >
        Lorem Ipsum.Lorem Ipsum.Lorem Ipsum.Lorem Ipsum.
      </Typography>
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          height: "90vh",
        }}
      >
        <Box
          flexDirection="column" // Arrange items horizontally
          alignItems="center"
          justifyContent="center"
          boxShadow={4}
          p={5}
          borderRadius={4}
          width={650}
        >
          <Grid container spacing={25} justifyContent="center">
            <Grid item xs={3}>
              {/* First set of buttons */}
              <Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Beachfront")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Beachfront")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,

                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="beachfront.png"
                        alt="Beachfront"
                        style={{
                          marginRight: "10px",
                          width: "40px",
                          height: "40px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Beachfront")}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <h4 style={styles.heading}>Beachfront</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Campers")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Campers")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,
                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="Campers.png"
                        alt="Campers"
                        style={{
                          marginRight: "10px",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Campers")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={styles.heading}>Campers</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Boat")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Boat")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,
                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="boat.png"
                        alt="Boat"
                        style={{
                          marginRight: "10px",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Boat")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={styles.heading}>Boat</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Second set of buttons */}
            <Grid item xs={3}>
              <Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Islands")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Islands")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,
                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="islands.png"
                        alt="Islands"
                        style={{
                          marginRight: "10px",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Islands")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={styles.heading}>Islands</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Waterfalls")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Waterfalls")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,
                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="waterfalls.png"
                        alt="Waterfalls"
                        style={{
                          marginRight: "10px",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Waterfalls")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={styles.heading}>Waterfalls</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Pools")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Pools")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,
                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="pools.png"
                        alt="Pools"
                        style={{
                          marginRight: "10px",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Pools")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={styles.heading}>Pools</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Third set of buttons */}
            <Grid item sx={3}>
              <Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Golf")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Golf")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,
                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="Golf.png"
                        alt="Golf"
                        style={{
                          marginRight: "10px",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Golf")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={styles.heading}>Golfing</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Camping")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Camping")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,
                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="camping.png"
                        alt="Camping"
                        style={{
                          marginRight: "10px",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Camping")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={styles.heading}>Camping</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: selectedButtons.includes("Beach")
                        ? "#16B4DD"
                        : "white",
                      color: selectedButtons.includes("Beach")
                        ? "white"
                        : "black",
                      fontFamily: "Poppins, sans-serif",
                      width: 200,
                      height: 80,
                      "&:hover": {
                        backgroundColor: "#16B4DD",
                        color: "white",
                        "& img": {
                          filter: "invert(100%)", // Apply a filter to change image color
                        },
                      },
                    }}
                    startIcon={
                      <img
                        src="beach.png"
                        alt="Beach"
                        style={{
                          marginRight: "10px",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                    }
                    onClick={() => handleButtonClick("Beach")}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <h4 style={styles.heading}>Beach</h4>
                      <span>&nbsp;</span>
                    </div>
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
