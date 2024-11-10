import React from "react";
import { Button, Container, Divider, Grid, Paper, Typography } from "@mui/material";
import { CheckCircle, Star, LocalActivity, ArrowForward } from "@mui/icons-material";
import "../../AccommodationRegistrationUI/css/Registration.css";
import { useNavigate } from "react-router-dom";
import AnimatePage from "./AnimatedPage";


export default function GettingStartedRegistration({ handleNext, handleBack }) {
  const navigate = useNavigate();
  const handleGettingStarted = () => {
    navigate("/list-property/create-listing");
  }
  return (
    <div className="gettingStarted-body">
      <div className="accommodation-registration-page">
        <div className="centered-container">
          <Container maxWidth="lg">
            <AnimatePage>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      margin: { xs: "2rem 0", md: "3rem 0" }, // Responsive margin
                      textAlign: { xs: "center", md: "left" }, // Center text on smaller screens
                    }}
                  >
                    List your <span style={{ color: "#F9CC41" }}>property</span> on CebuStay
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontSize: { xs: "1.2rem", md: "1.5rem" }, // Responsive font size
                      textAlign: { xs: "center", md: "left" }, // Center text on smaller screens
                    }}
                  >
                    Whether hosting is your sideline passion or full-time job, list your home today and quickly start earning more income.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "2rem",
                      borderRadius: "0.8rem",
                      border: "5px solid #F9CC41",
                      margin: { xs: "2rem 0", md: "3rem" }, // Responsive margin
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        textAlign: { xs: "center", md: "left" }, // Center text on smaller screens
                      }}
                    >
                      Showcase Your Cebu Property for Free
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                        textAlign: { xs: "center", md: "left" }, // Center text on smaller screens
                        flexDirection: { xs: "column", md: "row" }, // Stack icons and text on smaller screens
                      }}
                    >
                      <CheckCircle style={{ color: "#fbc02d", marginRight: "8px" }} />
                      <span>Join CebuStay and Connect with Travelers Seeking Authentic Local Stays!</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                        textAlign: { xs: "center", md: "left" }, // Center text on smaller screens
                        flexDirection: { xs: "column", md: "row" }, // Stack icons and text on smaller screens
                      }}
                    >
                      <Star style={{ color: "#fbc02d", marginRight: "8px" }} />
                      <span>Highlight Your Property’s Unique Cebu Appeal and Gain Visibility with Our Dedicated, Localized Platform</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                        textAlign: { xs: "center", md: "left" }, // Center text on smaller screens
                        flexDirection: { xs: "column", md: "row" }, // Stack icons and text on smaller screens
                      }}
                    >
                      <LocalActivity style={{ color: "#fbc02d", marginRight: "8px" }} />
                      <span>Tap into a Growing Market of Travelers Looking for Unique Cebu Adventures!</span>
                    </div>
                    <Divider sx={{ marginBottom: "1rem" }} />
                    <Button
                      variant="contained"
                      onClick={handleGettingStarted}
                      sx={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.8rem",
                        backgroundColor: "#16B4DD",
                        color: "#ffff",
                        fontWeight: "bold",
                        '&:hover': {
                          backgroundColor: "#A334CF",
                        },
                      }}
                    >
                      Get Started <ArrowForward />
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </AnimatePage>
          </Container>
        </div>
      </div>
    </div>
  );
}
