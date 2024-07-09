import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import ArrowRight from "@mui/icons-material/Send";
import "../css/PropertyBenefits.css";

const facilitiesIcons = {
  "Swimming Pool": "swimmingpool.png",
  Gym: "gym.png",
  "Wellness Facilities": "wellness.png",
  "Game Room": "gameroom.png",
  "Sports Facilities": "sports.png",
  Parking: "parking.png",
  "Business Center": "businesscenter.png",
};

const Facilities = ({ facilities = [] }) => (
  // useEffect(() => {
  //   console.log("Facilities:", facilities);
  // }, [facilities]);
  // if (facilities.length === 0) {
  //   return null;
  // }
  <Paper className="info-cntr" sx={{ borderRadius: "12px" }}>
    <div className="info-title-cntr">
      <ArrowRight sx={{ color: "#16B4DD" }} />
      <div>Facilities</div>
    </div>
    <Divider sx={{ width: "100%", color: "#ccc" }} />
    <div className="amenity-cntr">
      {facilities.map((facility) => (
        <div className="each-amenity" key={facility.facilities_name}>
          <img
            src={facilitiesIcons[facility.facilities_name]}
            alt={facility.facilities_name}
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          />
          <div className="rooms-name">{facility.facilities_name}</div>
        </div>
      ))}
    </div>
  </Paper>
);

export default function PropertyViewFacilities({ propertyinfo }) {
  const [loading, setLoading] = useState(true); // Loading state
  const [propertyInfo, setPropertyInfo] = useState();

  useEffect(() => {
    try {
      if (propertyinfo) {
        setPropertyInfo(propertyinfo);
        // console.log("PROPERTY INFO", propertyinfo);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [propertyinfo]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Facilities facilities={propertyInfo.property_facilities} />
      )}
    </div>
  );
}
