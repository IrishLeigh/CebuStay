import * as React from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";

export default function BasicButtons() {
  return (
    <Container
      style={{
        height: "100vh",
      }}
    >
      <div style={{ textAlign: "left", paddingBottom: "30px" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Property Information
          <Typography sx={{ fontSize: 18, mb: 2 }}>
            Please click the button you choose.
          </Typography>
        </Typography>
      </div>
      <Box textAlign="center">
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Available Amenities
        </Typography>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={3}>
            {/* First set of buttons */}
            <Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="wifi.png"
                      alt="Wifi"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      whileHover={{ scale: 1.2 }} // Scale up the image while hovering
                    />
                  }
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
                        m: 1,
                        textTransform: "none",
                      }}
                    >
                      Wi-Fi
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="parking.png"
                      alt="Parking"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Parking
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="minibar.png"
                      alt="Mini Bar"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Mini Bar
                    </Typography>
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
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="workspace.png"
                      alt="Workspace"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Workspace
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>

              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="bathroom.png"
                      alt="Bathroom"
                      style={{
                        marginRight: "10px",
                        width: "60px",
                        height: "60px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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
                        textTransform: "none",
                      }}
                    >
                      Bathroom
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="tv.png"
                      alt="Television"
                      style={{
                        marginRight: "10px",
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Television
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
            </Box>
          </Grid>
          {/* Third set of buttons */}
          <Grid item xs={3}>
            <Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="laundry.png"
                      alt="Laundry"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Laundry
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>

              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="refrigerator.png"
                      alt="Refrigerator"
                      style={{
                        marginRight: "10px",
                        width: "60px",
                        height: "60px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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
                        textTransform: "none",
                      }}
                    >
                      Refrigerator
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="microwave.png"
                      alt="Microwave"
                      style={{
                        marginRight: "10px",
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Microwave
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Available Services
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={3}>
            {/* First set of buttons */}
            <Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="roomservice.png"
                      alt="Room Service"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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
                        textTransform: "none",
                      }}
                    >
                      Room Service
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="cleaning.png"
                      alt="Cleaning Service"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Cleaning Service
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="call.png"
                      alt="Wake-up Call Service"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Wake-up Call Service
                    </Typography>
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
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="fitness.png"
                      alt="Fitness Center"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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
                      Fitness
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="transportation.png"
                      alt="Transportation"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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
                        textTransform: "none",
                      }}
                    >
                      Transportation
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="restaurant.png"
                      alt="Restaurant"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Restaurant
                    </Typography>
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
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="business.png"
                      alt="Business Center"
                      style={{
                        width: "60px",
                        height: "60px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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
                      Business Center
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="security.png"
                      alt="Security Service"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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
                        textTransform: "none",
                      }}
                    >
                      Security Service
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    color: "black",
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
                    <motion.img
                      src="spa.png"
                      alt="Spa and Wellness"
                      style={{
                        width: "50px",
                        height: "50px",
                      }}
                      whileHover={{ scale: 1.2 }}
                    />
                  }
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

                        textTransform: "none",
                      }}
                    >
                      Spa and Wellness
                    </Typography>
                    <span>&nbsp;</span>
                  </div>
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
