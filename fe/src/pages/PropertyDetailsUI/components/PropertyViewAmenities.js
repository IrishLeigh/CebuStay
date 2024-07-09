import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import ArrowRight from "@mui/icons-material/Send";
import "../css/PropertyBenefits.css";

const amenitiesIcons = {
  Toiletries: "toiletries.png",
  "Air Conditioning": "aircon.png",
  "Wi-Fi": "wifi.png",
  "Mini Bar": "minibar.png",
  Workspace: "workspace.png",
  Television: "tv.png",
  Refrigerator: "refrigerator.png",
  Microwave: "microwave.png",
};

const Amenities = ({ amenities = [] }) => (
  <Paper className="info-cntr" sx={{ borderRadius: "12px" }}>
    <div className="info-title-cntr">
      <ArrowRight sx={{ color: "#16B4DD" }} />
      <div>Amenities</div>
    </div>
    <Divider sx={{ width: "100%", color: "#ccc" }} />
    <div className="amenity-cntr">
      {/* Render the list of amenities or a message if no amenities are available */}
      {amenities.length > 0 ? (
        amenities.map((amenity) => (
          <div className="each-amenity" key={amenity.amenity_name}>
            <img
              src={amenitiesIcons[amenity.amenity_name]}
              alt={amenity.amenity_name}
              style={{ width: "24px", height: "24px", marginRight: "8px" }}
            />
            <div className="rooms-name">{amenity.amenity_name}</div>
          </div>
        ))
      ) : (
        <div className="no-amenities">No Amenities Available</div>
      )}
    </div>
  </Paper>
);

export default function PropertyViewAmenities({ propertyinfo }) {
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
        <Amenities amenities={propertyInfo.property_amenities} />
      )}
    </div>
  );
}
