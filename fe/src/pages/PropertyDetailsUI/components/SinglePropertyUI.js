import { Box, Container, Grid, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/SinglePropertyUI.css";
import PropertyOverView from "./PropertyOverView";
import PropertyInfo from "./PropertyInfo";
import ReservationSection from "./ReservationSection";
import ImageGallery from "./ImageGallery";
import dayjs from "dayjs";
import ReviewsAndRatingsSingleUnit from "./ReviewsAndRatings/ReviewsUI/ReviewsRatings";
import { useNavigate } from "react-router-dom";

export default function SinglePropertyUI(propertyid) {
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyInfo, setPropertyInfo] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [checkInDate, setCheckInDate] = useState(dayjs());
  const [checkOutDate, setCheckOutDate] = useState(dayjs().add(1, "day"));
  const [guestCount, setGuestCount] = useState(2);
  const navigate = useNavigate  (); // Initialize useNavigate

  const handleCheckInChange = (date) => setCheckInDate(date);
  const handleCheckOutChange = (date) => setCheckOutDate(date);
  
  // Handle reservation click
  const handleReserveClick = () => {
    // Format the query parameters
    const queryParams = new URLSearchParams({
      guestCount,
      checkInDate: checkInDate.format("YYYY-MM-DD"),
      checkOutDate: checkOutDate.format("YYYY-MM-DD"),
    }).toString();

    // Navigate to the booking route with propertyid and query params
    navigate(`/accommodation/booking/${propertyid.propertyid}?${queryParams}`);
  };
  const handleGuestCountChange = (event) => setGuestCount(event.target.value);

  // Fetch property images and info
  useEffect(() => {
    const fetchData = async () => {
      const propertyId = propertyid.propertyid; // Replace with the ID of the property you want to fetch
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/getfiles/${propertyId}`
        );
        if (res.data) {
          // Transform the image data
          // console.log("CAPTION HERE", res.data)
          const images = res.data.img.map((image, index) => ({
            id: image.id,
            caption: image.caption,
            src: image.src,
            rows: index === 0 ? 2 : 1,
            cols: index === 0 ? 2 : 1,
          }));

          // Set the transformed images to state
          setPropertyImages(images);

          const res2 = await axios.get(
            "http://127.0.0.1:8000/api/getproperty",
            {
              params: {
                propertyid: propertyId,
              },
            }
          );
          if (res2.data) {
            setPropertyInfo(res2.data);
            console.log ("FULL PROPERTY INFO", res2.data);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, []); // Empty dependency array to run once on mount

  // Conditionally render content based on loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <div style={{ paddingBottom: "2rem" }}>
        <ImageGallery images={propertyImages} />
        <div
          style={{
            height: "clamp(2rem, 5vw, 2rem)",
            display: "flex",
            marginTop: "-16px",
          }}
        >
          <div style={{ flex: "1 0 0", background: "#16B4DD" }} />
          <div style={{ flex: "1 0 0", background: "#ADC939" }} />
          <div style={{ flex: "1 0 0", background: "#F9CC41" }} />
          <div style={{ flex: "1 0 0", background: "#F77D1E" }} />
          <div style={{ flex: "1 0 0", background: "#EE414B" }} />
          <div style={{ flex: "1 0 0", background: "#A334CF" }} />
          <div style={{ flex: "1 0 0", background: "#1780CB" }} />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <PropertyOverView propertyinfo={propertyInfo} />
          </Grid>
          <Grid item xs={4}>
            <ReservationSection
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              handleCheckInChange={handleCheckInChange}
              handleCheckOutChange={handleCheckOutChange}
              handleReserveClick={handleReserveClick}
              guestCount={guestCount}
              handleGuestCountChange={handleGuestCountChange}
              propertyinfo={propertyInfo}
            />
          </Grid>
        </Grid>
        <PropertyInfo propertyInfo={propertyInfo} propertyImages={propertyImages} />
        <ReviewsAndRatingsSingleUnit propertyId={propertyid.propertyid} />
      </div>
    </Container>
  );
}
