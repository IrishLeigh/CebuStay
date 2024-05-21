import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { CssBaseline } from "@mui/material";

export default function ReservationForm() {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [roomData, setRoomData] = useState({
    imageUrl: property_images[0].src,
    benefits: ["Free Wi-Fi", "Parking", "Breakfast"],
    guests: 2,
    pricePerNight: "$100",
    booked: 5,
  });

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const [hovered, setHovered] = useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
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
        facilities_name: "Parking",
      },
      {
        facilitiesid: 38,
        facilities_name: "Pool",
      },
    ],
    property_services: [
      {
        serviceid: 39,
        service_name: "Housekeeping",
      },
      {
        serviceid: 40,
        service_name: "Breakfast",
      },
      {
        serviceid: 41,
        service_name: "PetFriendly",
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
        custom_rules: "No shoes inside the house. Keep the kitchen clean.",
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
    <Container maxWidth="xl">
      {/* Additional Paper Component for Property Policies */}
      <CssBaseline />
      <Paper
        elevation={0}
        style={{
          textAlign: "left",
          padding: "20px",
          boxShadow: "0 0 0 1px #D4CFCF",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        <Typography
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          Property Policies
        </Typography>
        {property_info.property_houserules.map((rule, index) => (
          <div key={index}>
            {[
              {
                label: "Smoking Allowed",
                value: rule.smoking_allowed ? "Yes" : "No",
              },
              {
                label: "Pets Allowed",
                value: rule.pets_allowed ? "Yes" : "No",
              },
              {
                label: "Parties Allowed",
                value: rule.parties_events_allowed ? "Yes" : "No",
              },
              { label: "Noise Restrictions", value: rule.noise_restrictions },
              {
                label: "Quiet Hours",
                value: `${rule.quiet_hours_start} - ${rule.quiet_hours_end}`,
              },
              { label: "Custom Rules", value: rule.custom_rules },
              {
                label: "Check-In",
                value: `${rule.check_in_from} - ${rule.check_in_until}`,
              },
              {
                label: "Check-Out",
                value: `${rule.check_out_from} - ${rule.check_out_until}`,
              },
            ].map(({ label, value }) => (
              <Typography key={label}>
                {label}: {value}
              </Typography>
            ))}
          </div>
        ))}
      </Paper>

      {/* Additional Paper Component for Booking Policy */}
      <Paper
        elevation={0}
        style={{
          textAlign: "left",
          padding: "20px",
          boxShadow: "0 0 0 1px #D4CFCF",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        <Typography
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          Booking Policy
        </Typography>
        <div style={{ marginLeft: "20px", width: "25%" }}>
          <Typography>
            Cancellation Plan:{" "}
            {property_info.property_bookingpolicy.is_cancel_plan ? "Yes" : "No"}
          </Typography>
          {property_info.property_bookingpolicy.is_cancel_plan && (
            <Typography>
              Days to Cancel: {property_info.property_bookingpolicy.cancel_days}
            </Typography>
          )}
          <Typography>
            Non-Refundable:{" "}
            {property_info.property_bookingpolicy.non_refundable ? "Yes" : "No"}
          </Typography>
          <Typography>
            Modification Plan:{" "}
            {property_info.property_bookingpolicy.modification_plan
              ? "Yes"
              : "No"}
          </Typography>
          <Typography>
            Offer Discount:{" "}
            {property_info.property_bookingpolicy.offer_discount ? "Yes" : "No"}
          </Typography>
        </div>
      </Paper>

      {/* Select Your Room */}
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
          Select Your Room
        </Typography>
      </Paper>

      {/* Room Details */}
      <Paper
        elevation={0}
        style={{
          textAlign: "left",
          padding: "20px",
          boxShadow: "0 0 0 1px #D4CFCF",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <div style={{ textAlign: "center" }}>
              <img
                src={roomData.imageUrl}
                alt="Placeholder"
                style={{ width: "100%", cursor: "pointer" }}
                onClick={handleImageClick}
              />
            </div>
            <div>
              <Typography
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                  margin: "10px 0",
                }}
              ></Typography>
              <Typography style={{ fontSize: "1rem", fontFamily: "Poppins" }}>
                {property_info.property_facilities.map((facility) => (
                  <Typography key={facility.facilitiesid}>
                    {facility.facilities_name}
                  </Typography>
                ))}
              </Typography>
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                <Grid item xs={12} md={4}>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                    }}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                  >
                    <Tooltip title="See All Details" arrow>
                      <Button
                        variant="outlined"
                        style={{
                          borderRadius: "50%", // Make the button circular
                          width: "50px", // Set width to create a smaller circle
                          height: "50px", // Set height to create a smaller circle
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 0,
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </Tooltip>
                    {hovered && (
                      <div
                        style={{
                          position: "absolute",
                          left: "calc(100% + 10px)",
                          transform: "translateY(50%)",
                          backgroundColor: "#fff",
                          padding: "20px",
                          boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                          zIndex: 10,
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "20px",
                          border: "1px solid #ddd",
                          bottom: "100%",
                        }}
                      >
                        <div>
                          <Typography
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                            }}
                          >
                            Amenities
                          </Typography>
                          {property_info.property_amenities.map((amenity) => (
                            <Typography key={amenity.amenityid}>
                              {amenity.amenity_name}
                            </Typography>
                          ))}
                        </div>
                        <div>
                          <Typography
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                            }}
                          >
                            Facilities
                          </Typography>
                          {property_info.property_facilities.map((facility) => (
                            <Typography key={facility.facilitiesid}>
                              {facility.facilities_name}
                            </Typography>
                          ))}
                        </div>
                        <div>
                          <Typography
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              fontFamily: "Poppins",
                            }}
                          >
                            Services
                          </Typography>
                          {property_info.property_services.map((service) => (
                            <Typography key={service.serviceid}>
                              {service.service_name}
                            </Typography>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
          {/* Room Details Table */}
          <Grid item xs={12} md={8}>
            <div style={{ border: "1px solid #D4CFCF", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Benefits</th>
                    <th>Guests</th>
                    <th>Price/Night</th>
                    <th>Booked</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span style={{ fontSize: "1rem", fontFamily: "Poppins" }}>
                        Your Price Includes:
                        <br />
                        {roomData.benefits.map((benefit, index) => (
                          <span key={index}>
                            {benefit}
                            <br />
                          </span>
                        ))}
                      </span>
                    </td>
                    <td>{roomData.guests} Guests</td>
                    <td>{roomData.pricePerNight}</td>
                    <td>{roomData.booked}</td>
                    <td>
                      <Button variant="contained" color="primary">
                        Book Now
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* Room Image Modal */}
      {isImageOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setIsImageOpen(false)}
        >
          <img src={roomData.imageUrl} alt="Placeholder" />
        </div>
      )}
    </Container>
  );
}
const property_images = [
  {
    id: 132,
    src: "https://drive.google.com/thumbnail?id=1SvJFWaxbMkDnjvemhQWmr0VOGvZhbxb0",
  },
  {
    id: 136,
    src: "https://drive.google.com/thumbnail?id=1jtRFdO-jnsvOyvFh6tgW7vx5VlviK6oD",
  },
  {
    id: 137,
    src: "https://drive.google.com/thumbnail?id=1Ft6hiOwuPoTKyIz-xgSbGS_qfsFu1Fvd",
  },
  {
    id: 138,
    src: "https://drive.google.com/thumbnail?id=1SLTFennA-9Vcueawn9KCRSTw8kWsC12t",
  },
  {
    id: 139,
    src: "https://drive.google.com/thumbnail?id=1HXBjDcLXETGT4JzQuSN0wKtzel8nOvCk",
  },
];
