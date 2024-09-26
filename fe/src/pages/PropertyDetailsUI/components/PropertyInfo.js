import React, { useState, useEffect } from "react";
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
  const [rooms, setTransformedRooms] = useState([]);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (propertyImages && propertyInfo && propertyInfo.property_unitdetails) {
      setPropertyImg(propertyImages);

      const allRooms = [];

      propertyInfo.property_unitdetails.forEach((unit) => {
        const unitrooms = unit.unitrooms || [];
        const unitbeds = unit.unitbeds || [];

        const detailedRooms = unitbeds.map((bedroom, index) => {
          const bedTypes = Object.entries(bedroom.beds || {}).map(
            ([type, count]) => (
              <div key={type}>
                {count} {type}
              </div>
            )
          );
          const name = `Bedroom #${index + 1}`;
          return { name, details: bedTypes };
        });

        const nonBedroomRooms = unitrooms
          .map((room) => {
            if (room.roomname === "Bedroom") {
              return null;
            }
            return { name: room.roomname };
          })
          .filter(Boolean);

        allRooms.push(...detailedRooms, ...nonBedroomRooms);
      });

      setTransformedRooms(allRooms);
    }
  }, [propertyImages, propertyInfo]);

  const isSingleUnit =
    propertyInfo?.property_unitdetails &&
    propertyInfo.property_unitdetails.length === 1;

  useEffect(() => {
    // Set the default section based on the property type
    if (isSingleUnit) {
      setActiveSection("gallery");
    } else {
      setActiveSection("amenities");
    }
  }, [isSingleUnit]);

  const renderSection = () => {
    if (isSingleUnit) {
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
    } else {
      switch (activeSection) {
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
    }
  };

  return (
    <div >
      <Box className="sort-menu">
        <button className="sort-btn">View As</button>
        {isSingleUnit && (
          <>
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
          </>
        )}
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
