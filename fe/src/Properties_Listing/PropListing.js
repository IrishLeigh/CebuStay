import React, { useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import WifiIcon from "@mui/icons-material/Wifi";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import BalconyIcon from "@mui/icons-material/Balcony";
import PoolIcon from "@mui/icons-material/Pool";
import { Container } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import ReservationForm from "../components/Reservation";

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

  const property_facilities = [
    {
      facilitiesid: 36,
      facilities_name: "Gym",
    },
    {
      facilitiesid: 37,
      facilities_name: "Parking Area",
    },
    {
      facilitiesid: 38,
      facilities_name: "Swimming Pool",
    },
  ];

  return (
    <>
      <Container maxWidth="xl" style={{ backgroundColor: "#F4F7FA" }}>
        <div>
          <ImageList variant="quilted" cols={4} rowHeight={250}>
            {itemData.map((item) => (
              <ImageListItem
                key={item.img}
                cols={item.cols || 1}
                rows={item.rows || 1}
              >
                <img
                  {...srcset(item.img, 121, item.rows, item.cols)}
                  alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
          {/* 7 horizontal colors */}
          <div
            style={{
              height: "45px", // Height of the colored line
              display: "flex",
              marginTop: "-20px",
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
                Megaworld, Cebu, Philippines
              </Typography>
              <Typography
                style={{ fontSize: "1.125rem", fontFamily: "Poppins" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              style={{
                left: "20px", // Adjust as needed
                textAlign: "left",
                padding: "10px",
                boxShadow: "0 0 0 1px #D4CFCF", // Add a 2px black stroke
                marginTop: "20px", // Add margin between sections
              }}
            >
              <Typography
                style={{
                  fontSize: "1.6rem",
                  fontFamily: "Poppins",
                }}
              >
                Highlights
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "10px", // Adjust as needed
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    marginRight: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <WifiIcon style={{ fontSize: "2rem", marginRight: "5px" }} />
                  <Typography
                    style={{
                      fontSize: "1.2rem",
                      fontFamily: "Poppins",
                      textAlign: "center",
                    }}
                  >
                    Free WiFi
                  </Typography>
                </div>
                <div
                  style={{
                    marginRight: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AcUnitIcon
                    style={{ fontSize: "2rem", marginRight: "5px" }}
                  />
                  <Typography
                    style={{
                      fontSize: "1.2rem",
                      fontFamily: "Poppins",
                      textAlign: "center",
                    }}
                  >
                    Air Conditioning
                  </Typography>
                </div>
                <div
                  style={{
                    marginRight: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BalconyIcon
                    style={{ fontSize: "2rem", marginRight: "5px" }}
                  />
                  <Typography
                    style={{
                      fontSize: "1.2rem",
                      fontFamily: "Poppins",
                      textAlign: "center",
                    }}
                  >
                    Balcony
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <PoolIcon style={{ fontSize: "2rem", marginRight: "5px" }} />
                  <Typography
                    style={{
                      fontSize: "1.2rem",
                      fontFamily: "Poppins",
                      textAlign: "center",
                    }}
                  >
                    Private Pool
                  </Typography>
                </div>
              </div>
            </Paper>
            <Paper
              elevation={0}
              style={{
                left: "20px", // Adjust as needed
                marginTop: "20px",
                textAlign: "left",
                padding: "10px",
                boxShadow: "0 0 0 1px #D4CFCF", // Add a 2px black stroke
              }}
            >
              <Typography
                style={{
                  fontSize: "1.6rem",
                  fontFamily: "Poppins",
                }}
              >
                Facilities
              </Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {property_facilities.map((facility) => (
                  <div style={{ marginLeft: "20px", width: "25%" }}>
                    <Typography key={facility.facilitiesid}>
                      {facility.facilities_name}
                    </Typography>
                  </div>
                ))}
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
                      flexDirection: "col",
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
          <Typography style={{ fontSize: "1.125rem", fontFamily: "Poppins" }}>
            Discover the vibrant hub of Megaworld Newtown Cebu, nestled in the
            heart of Mactan Island, easily accessible by taking a jeepney bound
            for Punta Engaño from downtown Cebu City.
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
            <li>
              Start from downtown Cebu City near SM City Cebu or Ayala Center
              Cebu, common transportation hubs.
            </li>
            <li>
              Look for jeepneys heading to "Punta Engaño" or "Lapu-Lapu City"
              for Mactan Island access.
            </li>
            <li>
              Board a jeepney with appropriate signage or ask locals for
              confirmation.
            </li>
            <li>
              Pay the fare, typically PHP 40 to PHP 50, and ensure exact change
              if possible.
            </li>
            <li>
              Traverse either the Marcelo Fernan Bridge or Mactan-Mandaue Bridge
              to Mactan Island.
            </li>

            <li>
              Disembark at Punta Engaño in Lapu-Lapu City, the final stop.
            </li>
            <li>
              Megaworld Newtown Cebu is located nearby, adjacent to Mactan
              Newtown.
            </li>
            <li>
              Walk a short distance from the jeepney stop to reach specific
              destinations within the complex.
            </li>
          </Typography>
        </Paper>
        <Paper
          elevation={0}
          style={{
            left: "20px", // Adjust as needed
            textAlign: "left",
            padding: "10px",
            maxWidth: "calc(65% - 40px)", // Adjust to leave space for padding
            top: "40px",
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
            Guest Reviews
          </Typography>
          {/* Progress Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridGap: "20px",
              marginTop: "20px",
            }}
          >
            <div>
              <Typography style={{ marginBottom: "5px" }}>
                Cleanliness:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.cleanliness * 10}
                style={{ height: "10px" }}
              />
            </div>
            <div>
              <Typography style={{ marginBottom: "5px" }}>Location:</Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.location * 10}
                style={{ height: "10px" }}
              />
            </div>
            <div>
              <Typography style={{ marginBottom: "5px" }}>
                Free Wi-Fi:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.freeWifi * 10}
                style={{ height: "10px" }}
              />
            </div>
            <div>
              <Typography style={{ marginBottom: "5px" }}>Staff:</Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.cleanliness * 10}
                style={{ height: "10px" }}
              />
            </div>
            <div>
              <Typography style={{ marginBottom: "5px" }}>
                Facilities:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.location * 10}
                style={{ height: "10px" }}
              />
            </div>
            <div>
              <Typography style={{ marginBottom: "5px" }}>Comfort:</Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.freeWifi * 10}
                style={{ height: "10px" }}
              />
            </div>
            <div>
              <Typography style={{ marginBottom: "5px" }}>Security:</Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.cleanliness * 10}
                style={{ height: "10px" }}
              />
            </div>
            <div>
              <Typography style={{ marginBottom: "5px" }}>
                Value for Money:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.location * 10}
                style={{ height: "10px" }}
              />
            </div>
            <div>
              <Typography style={{ marginBottom: "5px" }}>
                Food Quality:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={guestReview.freeWifi * 10}
                style={{ height: "10px" }}
              />
            </div>
          </div>
        </Paper>
        <ReservationForm />
      </Container>
    </>
  );
}

const itemData = [
  {
    img: "image1.png",
    title: "Image1",
    rows: 2,
    cols: 2,
  },
  {
    img: "image2.png",
    title: "Image2",
  },
  {
    img: "image3.png",
    title: "Image3",
  },
  {
    img: "image4.png",
    title: "Image4",
  },
  {
    img: "image5.png",
    title: "Image5",
  },
];
