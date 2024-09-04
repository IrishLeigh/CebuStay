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
  const [activeSection, setActiveSection] = useState("gallery");

  useEffect(() => {
    if (propertyImages && propertyInfo && propertyInfo.property_unitdetails) {
      setPropertyImg(propertyImages);
      setPropertyDetails(propertyInfo);
      console.log("ARI NAA?", propertyInfo);

      // Flattened arrays to hold all rooms and beds
      const allRooms = [];
      const allBeds = [];

      propertyInfo.property_unitdetails.forEach((unit) => {
        const unitrooms = unit.unitrooms || [];
        const unitbeds = unit.unitbeds || [];

        // Create a map to track which bedrooms have been added
        const bedroomMap = {};

        // Map through unitbeds to create bedroom entries with details
        const detailedRooms = unitbeds.map((bedroom, index) => {
          const bedTypes = Object.entries(bedroom.beds || {}).map(
            ([type, count]) => (
              <div key={type}>
                {count} {type}
              </div>
            )
          );
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
        allRooms.push(...detailedRooms, ...nonBedroomRooms);
      });

      console.log("COMBINED ROOMS", allRooms);
      setTransformedRooms(allRooms);
    }
  }, [propertyImages, propertyInfo]);

  const renderSection = () => {
    switch (activeSection) {
      case "gallery":
        return <RoomGallery propertyImages={propertyImg} />;
      case "details":
        return <RoomDetails rooms={rooms} />;
      case "amenities":
        return <PropertyViewAmenities propertyinfo={propertyInfo} />;
      case "facilities":
        return <PropertyViewFacilities propertyinfo={propertyInfo} />;
      case "services":
        return <PropertyViewServices propertyinfo={propertyInfo} />;
      case "houseRules":
        return <PropertyHouseRules propertyinfo={propertyInfo} />;
      case "cancellation":
        return <PropertyCancellation propertyinfo={propertyInfo} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Box className="sort-menu">
       <button
          className="sort-btn"
        >
          View As
        </button>
        <button
          className="sort-btn"
          onClick={() => setActiveSection("gallery")}
        >
          Gallery
        </button>
        <button
          className="sort-btn"
          onClick={() => setActiveSection("details")}
        >
          Room Details
        </button>
        <button
          className="sort-btn"
          onClick={() => setActiveSection("amenities")}
        >
          Property Amenities
        </button>
        <button
          className="sort-btn"
          onClick={() => setActiveSection("facilities")}
        >
          Property Facilities
        </button>
        <button
          className="sort-btn"
          onClick={() => setActiveSection("services")}
        >
          Property Services
        </button>
        <button
          className="sort-btn"
          onClick={() => setActiveSection("houseRules")}
        >
          Property Rules
        </button>
        <button
          className="sort-btn"
          onClick={() => setActiveSection("cancellation")}
        >
          Cancellation
        </button>
      </Box>

      {renderSection()}
    </div>
  );
}