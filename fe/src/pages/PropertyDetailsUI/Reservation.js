import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { CssBaseline } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Check, Close, Hotel, SingleBed, KingBed } from "@mui/icons-material";
import {useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function ReservationForm({
  propertyinfos,
  property_images,
  amenities,
  facilities,
  services,
  guestCount,
  checkin_date,
  checkout_date,
  propertyid
}) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  

  const handleBookNow = (e, propertyId) => {
    const state = {
      guestCount,
      checkin_date,
      checkout_date
    };
  
    navigate(`accommodation/booking/${propertyId}`, { state });
    console.log("Booking now...");
  };
  

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const handleHover = () => {
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const Directions = ({ directions }) => (
    <Paper
      elevation={0}
      style={{ textAlign: "left", padding: "10px", backgroundColor: "#F4F7FA" }}
    >
      <Typography
        style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "Poppins" }}
      >
        How to Get Here
      </Typography>
      <textarea
        style={{
          width: "65%",
          height: "200px",
          fontFamily: "Poppins",
          fontSize: "1.125rem",
          padding: "20px",
          border: "1px solid #D4CFCF",
          borderRadius: "4px",
          resize: "none",
        }}
        value={directions}
        readOnly
      />
    </Paper>
  );

  // console.log("PROPERTY ID NI DIRE KASABOT KA?:",propertyid);
  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <Grid item xs={12} md={8}>
        <Typography
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Poppins",
            textAlign: "left",
          }}
        >
          Select your unit
        </Typography>
        <div style={{ border: "1px solid #D4CFCF", padding: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th></th>
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
                  <img
                    src={property_images[0].src}
                    alt="Placeholder"
                    style={{ width: "100%", cursor: "pointer" }}
                    onClick={handleImageClick}
                  />
                  <tr>
                    <td>
                      <div>
                        <Typography
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            fontFamily: "Poppins",
                            margin: "10px 0",
                          }}
                        >
                          {propertyinfos.property_details.property_type}
                        </Typography>
                        {propertyinfos.property_unitrooms.unitbeds.map(
                          (bed, index) => (
                            <div key={index}>
                              <Typography>
                                <SingleBed style={{ marginRight: "8px" }} />
                                {bed.beds.singlebed} Single Bed
                              </Typography>
                              <Typography>
                                <KingBed style={{ marginRight: "8px" }} />
                                {bed.beds.largebed} Large Beds
                              </Typography>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                  </tr>

                  <td>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                      onMouseEnter={handleHover}
                      onMouseLeave={handleLeave}
                    >
                      <Tooltip title="" arrow>
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
                          {" "}
                          <div
                            style={{
                              flex: 1,
                              paddingRight: "20px",
                              minHeight: "300px",
                            }}
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
                              {amenities.map((amenity) => (
                                <div
                                  style={{ width: "50%" }}
                                  key={amenity.amenityid}
                                >
                                  <Typography>
                                    {amenity.amenity_name}
                                  </Typography>
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
                                <div
                                  style={{ width: "50%" }}
                                  key={facility.facilitiesid}
                                >
                                  <Typography>
                                    {facility.facilities_name}
                                  </Typography>
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
                                <div
                                  style={{ width: "50%" }}
                                  key={service.serviceid}
                                >
                                  <Typography>
                                    {service.service_name}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </td>
                <td>
                  {["Free Wi-Fi", "Parking", "Breakfast"].map(
                    (benefit, index) => (
                      <Typography key={index}>{benefit}</Typography>
                    )
                  )}
                </td>
                <td>
                  {guestCount} {guestCount > 1 ? "" : ""}
                </td>
                <td>
                  <Typography>
                    PHP {propertyinfos.property_unitpricing.min_price}
                  </Typography>
                </td>
                <td>
                  <Typography> No</Typography>
                </td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => handleBookNow(e, propertyinfos.property_details.propertyid)}>
                    Book Now
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Grid>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
          marginBottom: "20px",
        }}
      >
        <Paper
          elevation={0}
          style={{
            textAlign: "left",
            padding: "20px",
            boxShadow: "0 0 0 1px #D4CFCF",
            width: "65%", // Adjust width as needed
            marginRight: "10px", // Add space between the two papers
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
          <div style={{ marginTop: "20px" }}>
            {propertyinfos.property_houserules.map((rule, index) => (
              <div key={index} style={{ marginBottom: "40px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {" "}
                  {/* Align House Rules and Check-In/Check-Out in a row */}
                  <div style={{ marginRight: "20px" }}>
                    {" "}
                    {/* Added margin-right for spacing */}
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                      House Rules
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <TableContainer
                        component={Paper}
                        style={{ marginBottom: "20px" }}
                      >
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {rule.smoking_allowed ? (
                                  <Check
                                    style={{
                                      color: "green",
                                      marginRight: "8px",
                                    }}
                                  />
                                ) : (
                                  <Close
                                    style={{ color: "red", marginRight: "8px" }}
                                  />
                                )}
                                Smoking Allowed
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                {rule.pets_allowed ? (
                                  <Check
                                    style={{
                                      color: "green",
                                      marginRight: "8px",
                                    }}
                                  />
                                ) : (
                                  <Close
                                    style={{ color: "red", marginRight: "8px" }}
                                  />
                                )}
                                Pets Allowed
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                {rule.parties_events_allowed ? (
                                  <Check
                                    style={{
                                      color: "green",
                                      marginRight: "8px",
                                    }}
                                  />
                                ) : (
                                  <Close
                                    style={{ color: "red", marginRight: "8px" }}
                                  />
                                )}
                                Parties Allowed
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Noise Restrictions:</TableCell>
                              <TableCell>{rule.noise_restrictions}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Quiet Hours:</TableCell>
                              <TableCell>{`${rule.quiet_hours_start} - ${rule.quiet_hours_end}`}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Custom Rules:</TableCell>
                              <TableCell>{rule.custom_rules}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                  <div>
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                      Check-In/Check-Out
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Hotel style={{ marginRight: "8px" }} />
                              Check-In
                            </TableCell>
                            <TableCell>{`${rule.check_in_from} - ${rule.check_in_until}`}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Hotel style={{ marginRight: "8px" }} />
                              Check-Out
                            </TableCell>
                            <TableCell>{`${rule.check_out_from} - ${rule.check_out_until}`}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Paper>
        <Paper
          elevation={0}
          style={{
            textAlign: "left",
            padding: "20px",
            boxShadow: "0 0 0 1px #D4CFCF",
            width: "30%", // Adjust width as needed
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
          <div style={{ marginLeft: "20px" }}>
            <Typography>
              Cancellation Plan:{" "}
              {propertyinfos.property_bookingpolicy.is_cancel_plan
                ? "Yes"
                : "No"}
            </Typography>
            {propertyinfos.property_bookingpolicy.is_cancel_plan && (
              <Typography>
                Days to Cancel:{" "}
                {propertyinfos.property_bookingpolicy.cancel_days}
              </Typography>
            )}
            <Typography>
              Non-Refundable:{" "}
              {propertyinfos.property_bookingpolicy.non_refundable
                ? "Yes"
                : "No"}
            </Typography>
            <Typography>
              Modification Plan:{" "}
              {propertyinfos.property_bookingpolicy.modification_plan
                ? "Yes"
                : "No"}
            </Typography>
            <Typography>
              Offer Discount:{" "}
              {propertyinfos.property_bookingpolicy.offer_discount
                ? "Yes"
                : "No"}
            </Typography>
          </div>
        </Paper>
      </div>

      <Grid item xs={12} md={4}>
        <Directions
          directions={propertyinfos.property_details.property_directions}
        />
      </Grid>
    </Container>
  );
}
