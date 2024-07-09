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

const servicesIcons = {
  "House Keeping": "housekeeping.png",
  Breakfast: "breakfast.png",
  "Shuttle Service": "shuttle.png",
  "Car Rental": "carrental.png",
  "24hours Front Desk": "frontdesk.png",
  Concierge: "concierge.png",
  Laundry: "laundry.png",
  "Pet Friendly": "petfriendly.png",
  "Room Service": "roomservice.png",
  "Cleaning Service": "cleaningservice.png",
  "Wake-up Call Service": "wakeupcall.png",
};

const Services = ({ services = [] }) => {
  return (
    <Paper className="info-cntr" sx={{ borderRadius: "12px" }}>
      <div className="info-title-cntr">
        <ArrowRight sx={{ color: "#16B4DD" }} />
        <div>Services</div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc" }} />

      <div className="amenity-cntr">
        {services.length > 0 ? (
          services.map((service) => (
            <div className="each-amenity" key={service.service_name}>
              <img
                src={servicesIcons[service.service_name]}
                alt={service.service_name}
                style={{ width: "24px", height: "24px", marginRight: "8px" }}
              />
              <div className="rooms-name">{service.service_name}</div>
            </div>
          ))
        ) : (
          <div className="no-services">No Services Available</div>
        )}
      </div>
    </Paper>
  );
};

export default function PropertyViewServices({ propertyinfo }) {
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
        <Services services={propertyInfo.property_services} />
      )}
    </div>
  );
}
