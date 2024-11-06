import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Divider } from "@mui/material";
import ArrowRight from "@mui/icons-material/Send";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import CarRentalIcon from "@mui/icons-material/CarRental";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import PetsIcon from "@mui/icons-material/Pets";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import AlarmIcon from "@mui/icons-material/Alarm";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import "../css/PropertyBenefits.css";

const servicesIcons = {
  Housekeeping: <CleaningServicesIcon sx={{ color: "#16B4DD" }} />, // Updated icon
  Breakfast: <FreeBreakfastIcon sx={{ color: "#16B4DD" }} />,
  "Shuttle Service": <DirectionsBusIcon sx={{ color: "#16B4DD" }} />,
  "Car Rental": <CarRentalIcon sx={{ color: "#16B4DD" }} />,
  "24hours Front Desk": <LocalHotelIcon sx={{ color: "#16B4DD" }} />,
  Concierge: <LocalHotelIcon sx={{ color: "#16B4DD" }} />,
  Laundry: <LocalLaundryServiceIcon sx={{ color: "#16B4DD" }} />,
  "Pet Friendly": <PetsIcon sx={{ color: "#16B4DD" }} />,
  "Room Service": <RoomServiceIcon sx={{ color: "#16B4DD" }} />,
  "Cleaning Service": <CleaningServicesIcon sx={{ color: "#16B4DD" }} />,
  "Wake-up Call Service": <AlarmIcon sx={{ color: "#16B4DD" }} />,
};

const Services = ({ services = [] }) => {
  const uniqueServices = Array.from(
    new Set(services.map((s) => s.service_name))
  ); // Ensure each service is displayed only once

  return (
    <Paper className="info-cntr" sx={{ borderRadius: "12px" }}>
      <div className="info-title-cntr">
        <ArrowRight sx={{ color: "#16B4DD" }} />
        <div>Services</div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc" }} />

      <div className="amenity-cntr">
        {uniqueServices.length > 0 ? (
          uniqueServices.map((service) => (
            <div className="each-amenity" key={service}>
              {servicesIcons[service]}
              <div className="rooms-name" style={{ marginLeft: "8px" }}>
                {service}
              </div>
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
        <Services services={propertyInfo.property_services} />
      )}
    </div>
  );
}
