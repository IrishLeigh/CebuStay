import { Box, Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/SinglePropertyUI.css";
import PropertyOverView from "./PropertyOverView";
import PropertyInfo from "./PropertyInfo";
import HeaderUser from "../../../components/Header/HeaderUser";
import ReservationSection from "./ReservationSection";
import ImageGallery from "./ImageGallery";
import dayjs from "dayjs";
import ViewProperty from "./PropertyBenefits";
import AvailabilityTable from "./AvailabilityTable";
import SearchAvailabilityButton from "./SearchAvailabilityButton";
import ArrowRight from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";
import ReviewsAndRatingsSingleUnit from "./ReviewsAndRatings/ReviewsUI/ReviewsRatings";

export default function SinglePropertyUI(propertyid) {
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyInfo, setPropertyInfo] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [checkInDate, setCheckInDate] = useState(dayjs("2024-07-24"));
  const [checkOutDate, setCheckOutDate] = useState(dayjs("2024-07-30"));
  const [guestCount, setGuestCount] = useState(2);

  const handleCheckInChange = (date) => setCheckInDate(date);
  const handleCheckOutChange = (date) => setCheckOutDate(date);
  const handleReserveClick = () => {
    alert(
      `Reservation made for ${guestCount} guests from ${checkInDate.format(
        "MM/DD/YYYY"
      )} to ${checkOutDate.format("MM/DD/YYYY")}`
    );
  };
  const handleGuestCountChange = (event) => setGuestCount(event.target.value);

  useEffect(() => {
    const fetchData = async () => {
      const propertyId = propertyid.propertyid; // Replace with the ID of the property you want to fetch
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/getfiles/${propertyId}`
        );
        if (res.data) {
          // Transform the image data
          const images = res.data.img.map((image, index) => ({
            id: image.id,
            src: image.src,
            rows: index === 0 ? 2 : 1,
            cols: index === 0 ? 2 : 1,
          }));

          // Set the transformed images to state
          setPropertyImages(images);
          // console.log("PROPERTY IMAGES", images);
          const res2 = await axios.get(
            "http://127.0.0.1:8000/api/getproperty",
            {
              params: {
                propertyid: propertyId,
              },
            }
          );
          if (res2.data) {
            console.log("FULL PROPERTY INFO", res2.data);
            setPropertyInfo(res2.data);
            // console.log(
            //   "property name",
            //   res2.data.property_details.property_name
            // );
            // console.log("BOANG KAAA:", res2.property.data);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, []); // Update useEffect dependency

  return (
    <div>
      {/* <HeaderUser /> */}
      <Container maxWidth="lg">
        <div>
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
              {/* Content for 40% width */}
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
          <PropertyInfo
            propertyInfo={propertyInfo}
            propertyImages={propertyImages}
          />
        </div>
        {/* <div
          style={{
            width: "100%",
            height: "0.1rem",
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
            backgroundColor: "#A334CF",
          }}
        > */}
          {/* Design is still not Sure */}
        {/* </div>
        <div>
          <SearchAvailabilityButton />
        </div>

        <div>
          <AvailabilityTable propertyid={propertyid.propertyid} />
        </div> */}

        <div
          style={{
            width: "100%",
            height: "0.1rem",
            boxSizing: "border-box",
            margin: "20px 0", // Adds top and bottom margin of 20px
            padding: 0,
            backgroundColor: "#A334CF",
          }}
        >
          {/* Design is still not Sure */}
        </div>
        <div className="review-container" style={{ marginBottom: "20px" }}>
          <div className="info-title-cntr">
            <ArrowRight sx={{ color: "#16B4DD" }} />
            <div>Reviews And Ratings</div>
          </div>
          <Divider sx={{ width: "100%", color: "#ccc", margin: "20px 0" }} />{" "}
          <div>
            {/* <ReviewsRatings /> */}
            {/* <ReviewsAndRatingsMultiUnit /> */}
            <ReviewsAndRatingsSingleUnit propertyId={propertyid.propertyid} />
          </div>
        </div>
      </Container>
    </div>
  );
}
