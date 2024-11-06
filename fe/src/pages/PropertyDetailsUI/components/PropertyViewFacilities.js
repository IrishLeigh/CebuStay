import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import ArrowRight from "@mui/icons-material/Send";
import PoolIcon from "@mui/icons-material/Pool";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SpaIcon from "@mui/icons-material/Spa";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import "../css/PropertyBenefits.css";

const facilitiesIcons = {
  "Swimming Pool": <PoolIcon sx={{ color: "#16B4DD" }} />,
  Gym: <FitnessCenterIcon sx={{ color: "#16B4DD" }} />,
  "Wellness Facilities": <SpaIcon sx={{ color: "#16B4DD" }} />,
  "Game Room": <SportsEsportsIcon sx={{ color: "#16B4DD" }} />,
  "Sports Facilities": <SportsSoccerIcon sx={{ color: "#16B4DD" }} />,
  Parking: <LocalParkingIcon sx={{ color: "#16B4DD" }} />,
  "Business Center": <BusinessCenterIcon sx={{ color: "#16B4DD" }} />,
};

const Facilities = ({ facilities = [] }) => (
  <Paper className="info-cntr" sx={{ borderRadius: "12px" }}>
    <div className="info-title-cntr">
      <ArrowRight sx={{ color: "#16B4DD" }} />
      <div>Facilities</div>
    </div>
    <Divider sx={{ width: "100%", color: "#ccc" }} />
    <div className="amenity-cntr">
      {facilities.length > 0 ? (
        facilities.map((facility) => (
          <div className="each-amenity" key={facility.facilities_name}>
            {facilitiesIcons[facility.facilities_name]}
            <div className="rooms-name" style={{ marginLeft: "8px" }}>
              {facility.facilities_name}
            </div>
          </div>
        ))
      ) : (
        <div className="no-facilities">No Facilities Available</div>
      )}
    </div>
  </Paper>
);

export default function PropertyViewFacilities({ propertyinfo }) {
  const [loading, setLoading] = useState(true);
  const [propertyInfo, setPropertyInfo] = useState();

  useEffect(() => {
    try {
      if (propertyinfo) {
        setPropertyInfo(propertyinfo);
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
