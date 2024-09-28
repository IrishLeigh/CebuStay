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
import { useNavigate, useLocation } from "react-router-dom";
import Directions from "./Directions";

export default function SinglePropertyUI({ propertyid }) {
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyInfo, setPropertyInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(dayjs());
  const [checkOutDate, setCheckOutDate] = useState(dayjs().add(1, "day"));
  const [guestCount, setGuestCount] = useState(2);
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
   // Extract query parameters
   const searchParams = new URLSearchParams(location.search);
 

  const handleCheckInChange = (date) => setCheckInDate(date);
  const handleCheckOutChange = (date) => setCheckOutDate(date);
  const handleGuestCountChange = (event) => setGuestCount(event.target.value);

  // Handle reservation click
  const handleReserveClick = () => {
    if (!checkInDate && !checkOutDate ) {
      alert("Please select check-in and check-out dates ");
      return;
    }
    if (!guestCount || guestCount <= 0) {
      alert("Please enter valid number of guests");
      return;
      
    }
    const queryParams = new URLSearchParams({
      guestCount,
      checkInDate: checkInDate.format("YYYY-MM-DD"),
      checkOutDate: checkOutDate.format("YYYY-MM-DD"),
    }).toString();

    navigate(`accommodation/booking/${propertyid}?${queryParams}`);
  };

  useEffect(() => {
    setGuestCount(searchParams.get("guestCapacity") || 0);
    setCheckInDate(dayjs(searchParams.get("checkin_date") || ""));
    setCheckOutDate(dayjs(searchParams.get("checkout_date") || ""));
    
  }, []);
  // Fetch property data
  const fetchPropertyData = async () => {
    const propertyId = propertyid; // Use the property ID passed as a prop
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/getfiles/${propertyId}`);
      if (res.data) {
        const images = res.data.img.map((image, index) => ({
          id: image.id,
          caption: image.caption,
          src: image.src,
          rows: index === 0 ? 2 : 1,
          cols: index === 0 ? 2 : 1,
        }));
        setPropertyImages(images);

        const res2 = await axios.get("http://127.0.0.1:8000/api/getproperty", {
          params: {
            propertyid: propertyId,
          },
        });
        if (res2.data) {
          setPropertyInfo(res2.data);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when property ID changes or on mount
  useEffect(() => {
    fetchPropertyData();
  }, [propertyid]); // Add propertyid as a dependency

  // Fetch data when checkInDate, checkOutDate, or guestCount changes
  useEffect(() => {
    fetchPropertyData();
  }, [checkInDate, checkOutDate, guestCount]);

  // Conditionally render content based on loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <div style={{ paddingBottom: "2rem" }}>
        <ImageGallery images={propertyImages} />
        <div style={{ height: "clamp(2rem, 5vw, 2rem)", display: "flex", marginTop: "-16px" }}>
          <div style={{ flex: "1 0 0", background: "#16B4DD" }} />
          <div style={{ flex: "1 0 0", background: "#ADC939" }} />
          <div style={{ flex: "1 0 0", background: "#F9CC41" }} />
          <div style={{ flex: "1 0 0", background: "#F77D1E" }} />
          <div style={{ flex: "1 0 0", background: "#EE414B" }} />
          <div style={{ flex: "1 0 0", background: "#A334CF" }} />
          <div style={{ flex: "1 0 0", background: "#1780CB" }} />
        </div>
        <Grid container >
          <Grid item xs={12} sm={8}>
          <div style={{ margin: "1rem 1rem 0 0" }}>
              <PropertyOverView propertyinfo={propertyInfo} />
            </div>
            </Grid> 
            <Grid item xs={12} sm={4}>
              <div style={{ margin: "1rem 0 " }}>
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
              </div>
            </Grid>
        </Grid>
        <div style={{ margin: "1rem 0" }}>
          <Directions propertyid={propertyid.propertyid} />
        </div>
        <div style={{ margin: "1rem 0" }}>
          <PropertyInfo propertyInfo={propertyInfo} propertyImages={propertyImages} />
        </div>
        <div style={{ margin: "1rem 0" }}>
          <ReviewsAndRatingsSingleUnit propertyId={propertyid} />
        </div>
      </div>
    </div>
  );
}
