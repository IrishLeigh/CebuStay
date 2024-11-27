import React, { useState, useEffect } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Container, CssBaseline, Button, Grid, TextField } from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReservationForm from "./Reservation";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ImageGallery from "./components/ImageGallery";
import SinglePropertyUI from "./components/SinglePropertyUI";
import MultiPropertyUI from "./components/MultiPropertyUI";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}
const AmenitiesFacilitiesServices = ({
  amenities = [],
  facilities = [],
  services = [],
}) => (
  <Paper
    elevation={0}
    style={{
      marginTop: "20px",
      textAlign: "left",
      padding: "10px",
      boxShadow: "0 0 0 1px #D4CFCF",
    }}
  >
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <div style={{ flex: 1, paddingRight: "20px", minHeight: "300px" }}>
        <Typography
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          Amenities
        </Typography>
        <div style={{ flexWrap: "wrap" }}>
          {amenities.map((amenity) => (
            <div style={{ width: "50%" }} key={amenity.amenityid}>
              <Typography>{amenity.amenity_name}</Typography>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, paddingRight: "20px" }}>
        <Typography
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          Facilities
        </Typography>
        <div style={{ flexWrap: "wrap" }}>
          {facilities.map((facility) => (
            <div style={{ width: "50%" }} key={facility.facilitiesid}>
              <Typography>{facility.facilities_name}</Typography>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Typography
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          Services
        </Typography>
        <div style={{ flexWrap: "wrap" }}>
          {services.map((service) => (
            <div style={{ width: "50%" }} key={service.serviceid}>
              <Typography>{service.service_name}</Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Paper>
);

//RESERVATION SECTION
const ReservationSection = ({
  checkInDate,
  checkOutDate,
  handleCheckInChange,
  handleCheckOutChange,
  handleReserveClick,
  guestCount,
  handleGuestCountChange,
}) => (
  <Paper
    elevation={0}
    style={{ boxShadow: "0 0 0 1px #D4CFCF", padding: "20px" }}
  >
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <DatePicker
            label="Check-in"
            value={checkInDate}
            onChange={handleCheckInChange}
            minDate={dayjs()}
            // fullWidth
          />
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <DatePicker
            label="Check-out"
            value={checkOutDate}
            onChange={handleCheckOutChange}
            minDate={checkInDate ? checkInDate.add(1, "day") : dayjs()}
            // fullWidth
          />
        </div>
      </div>
    </LocalizationProvider>
    <hr style={{ borderTop: "1px solid #D4CFCF", margin: "20px 0" }} />
    <Typography
      style={{ fontSize: "1.6rem", fontFamily: "Poppins", textAlign: "left" }}
    >
      Guest
    </Typography>
    <TextField
      type="number"
      value={guestCount}
      onChange={handleGuestCountChange}
      fullWidth
      margin="normal"
    />
    <Typography
      style={{ fontSize: "1.6rem", fontFamily: "Poppins", textAlign: "left" }}
    >
      {guestCount} Guest{guestCount > 1 ? "s" : ""}
    </Typography>

    <Button
      variant="contained"
      color="primary"
      style={{ marginTop: "20px", width: "100%" }}
      onClick={handleReserveClick}
    >
      Reserve
    </Button>

    <Typography
      style={{
        fontSize: "1rem",
        fontFamily: "Poppins",
        textAlign: "center",
        marginTop: "20px",
        color: "#5E5E5E",
      }}
    >
      You won’t be charged yet
    </Typography>
  </Paper>
);

const PropertyDetails = ({ property }) => (
  <Paper
    elevation={0}
    style={{ textAlign: "left", padding: "10px", backgroundColor: "#F4F7FA" }}
  >
    <Typography
      style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "Poppins" }}
    >
      {property.property_name}
    </Typography>
    <Typography
      style={{
        fontSize: "1.1rem",
        fontWeight: "bold",
        fontFamily: "Poppins",
      }}
    >
      {property.property_desc}
    </Typography>
    <textarea
      style={{
        width: "100%",
        height: "100px",
        fontFamily: "Poppins",
        fontSize: "1.125rem",
        padding: "10px",
        border: "1px solid #D4CFCF",
        borderRadius: "4px",
        resize: "none",
      }}
      value={property.property_directions}
      readOnly
    />
  </Paper>
);

export default function ViewPropertyUI() {
  const { propertyid } = useParams();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guestCount, setGuestCount] = useState(0); // Sample initial value for guest count
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyInfo, setPropertyInfo] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const guestCapacity = searchParams.get("guestCapacity") || null;
  const checkin_date = searchParams.get("checkin_date") || null;
  const checkout_date = searchParams.get("checkout_date") || null;
  const [onSearchData, setOnSearchData] = useState({});
  //fetchdata for Property ID
  useEffect(() => {
    const fetchData = async () => {
      const propertyId = propertyid; // Replace with the ID of the property you want to fetch
      try {
        const res = await axios.get(
          `https://whitesmoke-shark-473197.hostingersite.com/api/getfiles/${propertyId}`
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
          const res2 = await axios.get(
            "https://whitesmoke-shark-473197.hostingersite.com/api/getproperty",
            {
              params: {
                propertyid: propertyId,
              },
            }
          );
          if (res2.data) {
            console.log("FULL PROPERTY INFO", res2.data);
            setPropertyInfo(res2.data);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, [propertyid]); // Update useEffect dependency

  // Set initial values based on the received state
  useEffect(() => {
    if (checkin_date && checkout_date && guestCapacity) {
      setOnSearchData({ checkin_date, checkout_date, guestCapacity });
    }
  }, [checkin_date, checkout_date, guestCapacity]);

  const handleCheckInChange = (date) => {
    setCheckInDate(date);
    if (checkOutDate && date.isAfter(checkOutDate)) {
      setCheckOutDate(date.add(1, "day"));
    }
  };

  const handleCheckOutChange = (date) => setCheckOutDate(date);

  const handleGuestCountChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1) {
      setGuestCount(value);
    }
  };

  //RESERVE NOW LOGIC
  const handleReserveClick = async () => {
    try {
      const reservationData = await axios.get(
        "https://whitesmoke-shark-473197.hostingersite.com/api/getavailableunits",
        {
          params: {
            checkin_date: checkin_date,
            checkout_date: checkout_date,
            guest_count: guestCount, // Use guestCount instead of guestCapacity
            propertyid: propertyid,
          },
        }
      );

      if (reservationData.data.length > 0) {
        // Use length property to check array length
        setShowReservationForm(true);
      } else {
        alert("NOTHING TO SHOW");
      }
    } catch (error) {
      console.error("Error fetching reservation data:", error);
      // Handle error here
    }
  };

  console.log("guestCapactiy", guestCapacity);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ backgroundColor: "#F4F7FA" }}>
        <Container maxWidth="xl">
          <CssBaseline />
          {/* {loading ? (
            <div>Loading...</div>
          ) : ( */}
          <div>
            {/* <div>
                <div id="image-gallery" style={{ display: "flex", flexWrap: "wrap" }}>
                  <ImageGallery images={propertyImages} />
                </div>
                <div style={{ height: "clamp(2rem, 5vw, 3rem)", display: "flex", marginTop: "-16px" }}>
                  <div style={{ flex: "1 0 0", background: "#16B4DD" }} />
                  <div style={{ flex: "1 0 0", background: "#ADC939" }} />
                  <div style={{ flex: "1 0 0", background: "#F9CC41" }} />
                  <div style={{ flex: "1 0 0", background: "#F77D1E" }} />
                  <div style={{ flex: "1 0 0", background: "#EE414B" }} />
                  <div style={{ flex: "1 0 0", background: "#A334CF" }} />
                  <div style={{ flex: "1 0 0", background: "#1780CB" }} />
                </div>
              </div>
              <Grid container spacing={3} style={{ padding: "20px 0" }}>
                <Grid item xs={12} md={7}>
                  {propertyInfo.property_details && (
                    <PropertyDetails property={propertyInfo.property_details} />
                  )}
                  <AmenitiesFacilitiesServices
                    amenities={propertyInfo.property_amenities}
                    facilities={propertyInfo.property_facilities}
                    services={propertyInfo.property_services}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <ReservationSection
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    handleCheckInChange={handleCheckInChange}
                    handleCheckOutChange={handleCheckOutChange}
                    handleReserveClick={handleReserveClick}
                    guestCount={guestCount}
                    handleGuestCountChange={handleGuestCountChange}
                  />
                </Grid>
              </Grid>
              {showReservationForm && (
                <ReservationForm
                  propertyinfos={propertyInfo}
                  property_images={propertyImages}
                  amenities={propertyInfo.property_amenities} // Pass amenities as prop
                  facilities={propertyInfo.property_facilities} // Pass facilities as prop
                  services={propertyInfo.property_services} // Pass services as prop
                  guestCount={guestCount}
                  propertyid={propertyid}
                  checkin_date={checkin_date}
                  checkout_date={checkout_date}
                />
              )} */}
            {/* {propertyInfo.property_details.property_type === "Home" ? (
                <><SinglePropertyUI propertyid={propertyid} onSearchData = {onSearchData}/></>
              ) : (
                <><MultiPropertyUI propertyid={propertyid}  onSearchData = {onSearchData}/></>
                )} */}
            <SinglePropertyUI
              propertyid={propertyid}
              onSearchData={onSearchData}
            />
          </div>

          {/* )} */}
        </Container>
      </div>
    </div>
  );
}
