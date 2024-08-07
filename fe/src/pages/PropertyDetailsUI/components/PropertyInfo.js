import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import "../css/PropertyInfo.css";
import RoomDetails from "./RoomDetails";
import RoomGallery from "./RoomGallery";
import PropertyViewAmenities from "./PropertyViewAmenities";
import PropertyViewFacilities from "./PropertyViewFacilities";
import PropertyViewServices from "./PropertyViewServices";
import PropertyHouseRules from "./PropertyHouseRules";
import PropertyCancellation from "./Cancellation";

export default function PropertyInfo({ propertyImages, propertyInfo }) {
  const [propertyImg, setPropertyImg] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [rooms, setTransformedRooms] = useState([]);

  useEffect(() => {
    if (propertyImages && propertyInfo && propertyInfo.property_unitrooms) {
      setPropertyImg(propertyImages);
      setPropertyDetails(propertyInfo);

      const unitrooms = propertyInfo.property_unitrooms.unitrooms || [];
      const unitbeds = propertyInfo.property_unitrooms.unitbeds || [];

      // Create a map to track which bedrooms have been added
      const bedroomMap = {};

      // Map through unitbeds to create bedroom entries with details
      const detailedRooms = unitbeds.map((bedroom, index) => {
        const bedTypes = Object.entries(bedroom.beds).map(([type, count]) => (
          <div key={type}>
            {count} {type}
          </div>
        ));
        const name = `Bedroom #${index + 1}`;
        bedroomMap[name] = true;
        return { name, details: bedTypes };
      });

      // Add non-bedroom rooms from unitrooms
      const nonBedroomRooms = unitrooms
        .map((room) => {
          if (room.roomname === "Bedroom") {
            return null; // Skip bedroom as they are already handled
          }
          return { name: room.roomname };
        })
        .filter(Boolean);

      // Combine detailedRooms and nonBedroomRooms
      const combinedRooms = [...detailedRooms, ...nonBedroomRooms];

      setTransformedRooms(combinedRooms);
    }
  }, [propertyImages, propertyInfo]);

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
        <button
          className="sort-btn"
          onClick={() => scrollToSection(galleryRef)}
        >
          Gallery
        </button>
        <button
          className="sort-btn"
          onClick={() => scrollToSection(detailsRef)}
        >
          Room Details
        </button>
        <button
          className="sort-btn"
          onClick={() => scrollToSection(amenitiesRef)}
        >
          Property Amenities
        </button>
        <button
          className="sort-btn"
          onClick={() => scrollToSection(facilitiesRef)}
        >
          Property Facilities
        </button>
        <button
          className="sort-btn"
          onClick={() => scrollToSection(servicesRef)}
        >
          Property Services
        </button>
        <button
          className="sort-btn"
          onClick={() => scrollToSection(houseRulesRef)}
        >
          Property Rules
        </button>
        <button
          className="sort-btn"
          onClick={() => scrollToSection(cancellationRef)}
        >
          Cancellation
        </button>
      </Box>

      <div ref={galleryRef}>
        <RoomGallery propertyImages={propertyImg} />
      </div>
      <div ref={detailsRef}>
        <RoomDetails rooms={rooms} />
      </div>
      <div ref={amenitiesRef}>
        <PropertyViewAmenities propertyinfo={propertyDetails} />
      </div>
      <div ref={facilitiesRef}>
        <PropertyViewFacilities propertyinfo={propertyDetails} />
      </div>
      <div ref={servicesRef}>
        <PropertyViewServices propertyinfo={propertyDetails} />
      </div>
      <div ref={houseRulesRef}>
        <PropertyHouseRules propertyinfo={propertyDetails} />
      </div>
      <div ref={cancellationRef}>
        <PropertyCancellation propertyinfo={propertyDetails} />
      </div>
    </div>
  );
}
