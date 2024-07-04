import React, { useRef } from "react";
import { Box } from "@mui/material";
import "../css/PropertyInfo.css";
import RoomDetails from "./RoomDetails";
import RoomGallery from "./RoomGallery";
import PropertyViewAmenities from "./PropertyViewAmenities";
import PropertyViewFacilities from "./PropertyViewFacilities";
import PropertyViewServices from "./PropertyViewServices";
import PropertyHouseRules from "./PropertyHouseRules";
import PropertyCancellation from "./Cancellation";

export default function PropertyInfo() {
  const rooms = [
    { name: "Bedroom", details: "1 double bed" },
    { name: "Living room" },
    { name: "Bathroom" },
    { name: "Meeting room" }
  ];

  // Create refs for each section
  const galleryRef = useRef(null);
  const detailsRef = useRef(null);
  const amenitiesRef = useRef(null);
  const facilitiesRef = useRef(null);
  const servicesRef = useRef(null);
  const houseRulesRef = useRef(null);
  const cancellationRef = useRef(null);

  // Scroll to the section referenced
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Box className="sort-menu">
        <button className="sort-btn" onClick={() => scrollToSection(galleryRef)}>Gallery</button>
        <button className="sort-btn" onClick={() => scrollToSection(detailsRef)}>Room Details</button>
        <button className="sort-btn" onClick={() => scrollToSection(amenitiesRef)}>Property Amenities</button>
        <button className="sort-btn" onClick={() => scrollToSection(facilitiesRef)}>Property Facilities</button>
        <button className="sort-btn" onClick={() => scrollToSection(servicesRef)}>Property Services</button>
        <button className="sort-btn" onClick={() => scrollToSection(houseRulesRef)}>Property Rules</button>
        <button className="sort-btn" onClick={() => scrollToSection(cancellationRef)}>Cancellation</button>
      </Box>

      <div ref={galleryRef}>
        <RoomGallery />
      </div>
      <div ref={detailsRef}>
        <RoomDetails rooms={rooms} />
      </div>
      <div ref={amenitiesRef}>
        <PropertyViewAmenities />
      </div>
      <div ref={facilitiesRef}>
        <PropertyViewFacilities />
      </div>
      <div ref={servicesRef}>
        <PropertyViewServices />
      </div>
      <div ref={houseRulesRef}>
        <PropertyHouseRules />
      </div>
      <div ref={cancellationRef}>
        <PropertyCancellation />
      </div>
    </div>
  );
}
