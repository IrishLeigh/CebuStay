import React, { useState } from "react";
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

  const property_info = {
    property_details: {
      propertyid: 60,
      property_name: "GardenBert",
      property_desc: "Elahang Ludi sa Lacion",
      property_type: "Home",
      property_directions:
        "Discover the vibrant hub of Megaworld Newtown Cebu, nestled in the heart of Mactan Island, easily accessible by taking a jeepney bound for Punta Engaño from downtown Cebu City. Start from downtown Cebu City near SM City Cebu or Ayala Center Cebu, common transportation hubs. Look for jeepneys heading to Punta Engaño or Lapu-Lapu City for Mactan Island access. Board a jeepney with appropriate signage or ask locals for confirmation. Pay the fare, typically PHP 40 to PHP 50, and ensure exact change if possible. Traverse either the Marcelo Fernan Bridge or Mactan-Mandaue Bridge to Mactan Island. Disembark at Punta Engaño in Lapu-Lapu City, the final stop. Megaworld Newtown Cebu is located nearby, adjacent to Mactan Newtown. Walk a short distance from the jeepney stop to reach specific destinations within the complex.",
      unit_type: "Private room",
    },
    property_address: {
      address: "Labangon",
      zipcode: "6009",
      latitude: "12312532",
      longitude: "9823082098",
    },
    property_home: {
      homeid: 26,
      proppricingid: 10,
      isoccupied: 0,
    },
    property_unitpricing: {
      min_price: 1000,
    },
    property_unitrooms: {
      unitid: 49,
      guest_capacity: 3,
      unitrooms: [
        {
          unitroomid: 177,
          roomname: "Bedroom",
          quantity: 2,
        },
        {
          unitroomid: 178,
          roomname: "Living Room",
          quantity: 1,
        },
        {
          unitroomid: 179,
          roomname: "Bathroom",
          quantity: 2,
        },
      ],
      unitbeds: [
        {
          bedroomnum: "1",
          beds: {
            singlebed: 2,
          },
        },
        {
          bedroomnum: "2",
          beds: {
            largebed: 2,
          },
        },
      ],
    },
    property_amenities: [
      {
        amenityid: 44,
        amenity_name: "Toiletries",
      },
      {
        amenityid: 45,
        amenity_name: "Television",
      },
    ],
    property_facilities: [
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
    ],
    property_services: [
      {
        serviceid: 39,
        service_name: "House Keeping",
      },
      {
        serviceid: 40,
        service_name: "Breakfast",
      },
      {
        serviceid: 41,
        service_name: "Pet Friendly",
      },
    ],
    property_houserules: [
      {
        houserulesid: 21,
        smoking_allowed: 1,
        pets_allowed: 0,
        parties_events_allowed: 1,
        noise_restrictions: "No loud noises after 10 PM",
        quiet_hours_start: "22:00:00",
        quiet_hours_end: "07:00:00",
        custom_rules: "No shoes inside the house.\nKeep the kitchen clean.",
        check_in_from: "14:00:00",
        check_in_until: "22:00:00",
        check_out_from: "08:00:00",
        check_out_until: "11:00:00",
      },
    ],
    property_bookingpolicy: {
      bookingpolicyid: 14,
      is_cancel_plan: 1,
      cancel_days: 7,
      non_refundable: 1,
      modification_plan: 1,
      offer_discount: 0,
    },
  };

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
            {property_images.map((image) => (
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
                {property_info.property_details.property_name}
              </Typography>
              <Typography
                style={{ fontSize: "1.125rem", fontFamily: "Poppins" }}
              >
                {property_info.property_details.property_desc}
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
                    {property_info.property_amenities.map((amenity) => (
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
                    {property_info.property_facilities.map((facility) => (
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
                    {property_info.property_services.map((service) => (
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
            {property_info.property_details.property_directions}
          </Typography>
        </Paper>
        <ReservationForm />
      </Container>
    </>
  );
}

const property_images = [
  {
    id: 132,
    src: "https://drive.google.com/thumbnail?id=1SvJFWaxbMkDnjvemhQWmr0VOGvZhbxb0",
    rows: 2,
    cols: 2,
  },
  {
    id: 136,
    src: "https://drive.google.com/thumbnail?id=1jtRFdO-jnsvOyvFh6tgW7vx5VlviK6oD",
    rows: 1,
    cols: 1,
  },
  {
    id: 137,
    src: "https://drive.google.com/thumbnail?id=1Ft6hiOwuPoTKyIz-xgSbGS_qfsFu1Fvd",
    cols: 1,
    rows: 1,
  },
  {
    id: 138,
    src: "https://drive.google.com/thumbnail?id=1SLTFennA-9Vcueawn9KCRSTw8kWsC12t",
    cols: 1,
    rows: 1,
  },
  {
    id: 139,
    src: "https://drive.google.com/thumbnail?id=1HXBjDcLXETGT4JzQuSN0wKtzel8nOvCk",
    cols: 1,
    rows: 1,
  },
];
