import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"; // Import Snackbar and Alert
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
  const [galleryImages, setGalleryImages] = useState([]); // State for gallery images
  const [propertyInfo, setPropertyInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(dayjs());
  const [checkOutDate, setCheckOutDate] = useState(dayjs().add(1, "day"));
  const [guestCount, setGuestCount] = useState(2);
  const [rating, setRating] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);

  const handleCheckInChange = (date) => setCheckInDate(date);
  const handleCheckOutChange = (date) => setCheckOutDate(date);
  const handleGuestCountChange = (event) => setGuestCount(event.target.value);

  useEffect(() => {
    setGuestCount(searchParams.get("guestCapacity") || 0);
    setCheckInDate(dayjs(searchParams.get("checkin_date") || ""));
    setCheckOutDate(dayjs(searchParams.get("checkout_date") || ""));
  }, []);

  // Fetch property data
  const fetchPropertyData = async () => {
    const propertyId = propertyid; // Use the property ID passed as a prop
    try {
      const res = await axios.get(
        `https://whitesmoke-shark-473197.hostingersite.com/api/getfiles/${propertyId}`
      );
      if (res.data) {
        const images = res.data.img.map((image, index) => ({
          id: image.id,
          caption: image.caption,
          src: image.src,
          rows: index === 0 ? 2 : 1,
          cols: index === 0 ? 2 : 1,
        }));
        setPropertyImages(images);

        const res2 = await axios.get(
          "https://whitesmoke-shark-473197.hostingersite.com/api/getproperty",
          {
            params: {
              propertyid: propertyId,
            },
          }
        );
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

  // Fetch gallery images
  const fetchGalleryImages = async () => {
    const propertyId = propertyid;
    try {
      const res = await axios.get(
        `https://whitesmoke-shark-473197.hostingersite.com/api/getgalleryimg/${propertyId}`
      );
      if (res.data) {
        const gallery = res.data.galleryPhotos.map((image) => ({
          id: image.id,
          caption: image.caption,
          src: image.src,
        }));
        setGalleryImages(gallery);
        console.log("gallery NI SYA SA RES", res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch data when property ID changes or on mount
  useEffect(() => {
    fetchPropertyData();
    fetchGalleryImages(); // Call to fetch gallery images
  }, [propertyid]); // Add propertyid as a dependency

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

  // Snackbar close handler
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Handle reservation click
  const handleReserveClick = async () => {
    console.log("Reserve clicked");
    console.log("Propertyid", propertyid);
    console.log("Checkin Date", checkInDate.format("YYYY-MM-DD"));
    console.log("Checkout Date", checkOutDate.format("YYYY-MM-DD"));

    if (!checkInDate || !checkOutDate) {
      setSnackbarMessage("Please select check-in and check-out dates");
      setSnackbarOpen(true);
      return;
    }
    if (!guestCount || guestCount <= 0) {
      setSnackbarMessage("Please enter a valid number of guests");
      setSnackbarOpen(true);
      return;
    }

    if (guestCount > propertyInfo.property_unitdetails.guest_capacity) {
      setSnackbarMessage("Number of guests cannot exceed guest capacity");
      setSnackbarOpen(true);
      return;
    }

    const queryParams = new URLSearchParams({
      guestCount,
      checkInDate: checkInDate.format("YYYY-MM-DD"),
      checkOutDate: checkOutDate.format("YYYY-MM-DD"),
    }).toString();

    try {
      const res = await axios.post(
        "https://whitesmoke-shark-473197.hostingersite.com/api/checkbooking",
        {
          checkin_date: checkInDate.format("YYYY-MM-DD"),
          checkout_date: checkOutDate.format("YYYY-MM-DD"),
          guest_count: guestCount,
          propertyid: propertyid,
        }
      );

      if (res.data) {
        console.log("Response", res.data);
        if (res.data.status === "error") {
          setSnackbarMessage(res.data.message);
          setSnackbarOpen(true);
        } else if (res.data.status === "success") {
          navigate(`/booking/${propertyid}?${queryParams}`);
        }
      }
    } catch (error) {
      console.log(error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarOpen(true);
    }
  };

  console.log("GALLERY IMAGES IN PARENT", galleryImages);
  console.log("Property info", propertyInfo);

  return (
    <div>
      <div style={{ paddingBottom: "2rem" }}>
        <ImageGallery images={propertyImages} />
        {/* <ImageGallery images={galleryImages} /> Render gallery images */}
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
        <Grid container>
          <Grid item xs={12} sm={8}>
            <div style={{ margin: "1rem 1rem 0 0" }}>
              <PropertyOverView propertyinfo={propertyInfo} rating={rating} />
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
          <Directions propertyid={propertyid} />
        </div>
        <div style={{ margin: "1rem 0" }}>
          <PropertyInfo
            propertyInfo={propertyInfo}
            propertyImages={propertyImages}
            galleryImages={galleryImages}
          />
        </div>
        <div style={{ margin: "1rem 0" }}>
          <ReviewsAndRatingsSingleUnit
            propertyId={propertyid}
            setRatingg={setRating}
          />
        </div>
      </div>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
