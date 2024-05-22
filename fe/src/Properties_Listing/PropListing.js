import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Container, CssBaseline } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import ReservationForm from "./Reservation";
import axios from "axios";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function QuiltedImageList() {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);

  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyInfo, setPropertyInfo] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      const propertyId = 60; // Replace with the ID of the property you want to fetch
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
          console.log("PROPERTY IMAGES", images);
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
            console.log(
              "property name",
              res2.data.property_details.property_name
            );
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, []);

  const [guestReview, setGuestReview] = useState({
    cleanliness: 0,
    location: 0,
    freeWifi: 0,
    staff: 0,
    facilities: 0,
    comfort: 0,
  });

  const handleCheckInChange = (date) => {
    setCheckInDate(date);
    if (checkOutDate && date.isAfter(checkOutDate)) {
      setCheckOutDate(date.add(1, "day"));
    }
  };

  const handleCheckOutChange = (date) => {
    setCheckOutDate(date);
  };

  const handleReviewChange = (category, value) => {
    setGuestReview({
      ...guestReview,
      [category]: value,
    });
  };

  // Calculate average rating
  const totalReviews = Object.values(guestReview).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const averageRating = totalReviews / Object.keys(guestReview).length;

  const handleReserveClick = () => {
    setShowReservationForm(true);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" style={{ backgroundColor: "#F4F7FA" }}>
        <CssBaseline />
        <Typography variant="h4">Loading...</Typography>
      </Container>
    );
  }

  if (!propertyInfo) {
    return (
      <Container maxWidth="xl" style={{ backgroundColor: "#F4F7FA" }}>
        <CssBaseline />
        <Typography variant="h4">No property information available</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl" style={{ backgroundColor: "#F4F7FA" }}>
        <CssBaseline />
        <div id="image-gallery" style={{ display: "flex", flexWrap: "wrap" }}>
          <ImageList
            variant="quilted"
            cols={4}
            rowHeight={Math.floor(window.innerHeight / 4)}
          >
            {propertyImages.map((image) => (
              <ImageListItem
                key={image.id}
                cols={image.cols || 1}
                rows={image.rows || 1}
              >
                <img
                  src={image.src}
                  alt={`Property Image ${image.id}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
        <div>
          {/* 7 horizontal colors */}
          <div
            style={{
              height: "45px", // Height of the colored line
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
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "20px 0px 20px",
          }}
        >
          <div
            style={{
              width: "65%",
              marginRight: "10px",
            }}
          >
            <Paper
              elevation={0}
              style={{
                left: "20px", // Adjust as needed
                textAlign: "left",
                backgroundColor: "#F4F7FA",
              }}
            >
              <Typography
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                {propertyInfo.property_details.property_name}
              </Typography>
              <Typography
                style={{ fontSize: "1.125rem", fontFamily: "Poppins" }}
              >
                {propertyInfo.property_details.property_desc}
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              style={{
                marginTop: "20px",
                textAlign: "left",
                padding: "10px",
                boxShadow: "0 0 0 1px #D4CFCF", // Add a 2px black stroke
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{ flex: 1, paddingRight: "20px", minHeight: "300px" }}
                >
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
                    {propertyInfo.property_amenities.map((amenity) => (
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
                    {propertyInfo.property_facilities.map((facility) => (
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
                    {propertyInfo.property_services.map((service) => (
                      <div style={{ width: "50%" }} key={service.serviceid}>
                        <Typography>{service.service_name}</Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Paper>
          </div>
          <div
            style={{
              textAlign: "left",
              width: "35%",
              marginLeft: "10px",
            }}
          >
            <Paper
              elevation={0}
              style={{
                boxShadow: "0 0 0 1px #D4CFCF", // Add a 2px black stroke
                padding: "20px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker", "DatePicker"]}>
                  <div
                    style={{
                      marginTop: "40px",
                      display: "flex",
                    }}
                  >
                    <DatePicker
                      label="Check-in"
                      value={checkInDate}
                      onChange={handleCheckInChange}
                      minDate={dayjs()}
                    />

                    <DatePicker
                      label="Check-out"
                      value={checkOutDate}
                      onChange={handleCheckOutChange}
                      minDate={
                        checkInDate ? checkInDate.add(1, "day") : dayjs()
                      }
                    />
                  </div>
                </DemoContainer>
              </LocalizationProvider>
              {/* Horizontal line */}
              <hr
                style={{ borderTop: "1px solid #D4CFCF", margin: "20px 0" }}
              />
              {/* Typography for "Guest" */}
              <Typography
                style={{
                  fontSize: "1.6rem",
                  fontFamily: "Poppins",
                  textAlign: "left",
                }}
              >
                Guest
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "100px", width: "100%" }}
                onClick={handleReserveClick}
              >
                Reserve
              </Button>
              <Typography
                style={{
                  fontSize: "1rem",
                  fontFamily: "Poppins",
                  textAlign: "center",
                  marginTop: "10px",
                  color: "#5E5E5E",
                }}
              >
                You won’t be charged yet
              </Typography>
            </Paper>
          </div>
        </div>

        <Paper
          elevation={0}
          style={{
            textAlign: "left",
            padding: "10px",
            backgroundColor: "#F4F7FA",
          }}
        >
          <Typography
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              fontFamily: "Poppins",
            }}
          >
            How to Get Here
          </Typography>
          <Typography
            component="ul" // Render as an unordered list
            style={{
              listStyleType: "disc", // Set bullet style
              fontSize: "1.125rem",
              fontFamily: "Poppins",
              paddingLeft: "20px", // Add left padding to match bullet
            }}
          >
            {propertyInfo.property_details.property_directions}
          </Typography>
        </Paper>
        <ReservationForm />
      </Container>
    </>
  );
}
