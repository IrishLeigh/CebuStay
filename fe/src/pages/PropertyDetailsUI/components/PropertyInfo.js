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

export default function PropertyInfo({ propertyImages, propertyInfo, galleryImages }) {
  const [propertyImg, setPropertyImg] = useState([]);
  const [rooms, setTransformedRooms] = useState([]);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (propertyImages && galleryImages && propertyInfo && propertyInfo.property_unitdetails) {
      setPropertyImg(propertyImages);

      const allRooms = [];

      propertyInfo.property_unitdetails.forEach((unit) => {
        const unitrooms = unit.unitrooms || [];
        const unitbeds = unit.unitbeds || [];

        const detailedRooms = unitbeds.map((bedroom, index) => {
          const bedTypes = Object.entries(bedroom.beds || {}).map(([type, count]) => (
            <div key={type}>
              {count} {type}
            </div>
          ));
          const bedtype =
          bedroom.sleepingtype === "room" ? "Bedroom" : "Bedspace";
           const name = `${bedtype} #${index + 1}`;
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

  const isSingleUnit = propertyInfo?.property_unitdetails && propertyInfo.property_unitdetails.length === 1;

  useEffect(() => {
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
          return <RoomGallery propertyImages={propertyImg} galleryImages={galleryImages} />;
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
    <div>
      <div className="property-filter-container">
        {/* Filter buttons for categories */}
        <button
          className="property-filter-btn"
          style={{
            backgroundColor: "#16B4DD",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => setActiveSection("gallery")}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            {/* Removed Image */}
          </div>
          Gallery
        </button>
        
        {isSingleUnit && (
          <button
            className="map-filter-btn"
            style={{
              backgroundColor: "#ADC939",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => setActiveSection("details")}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
              }}
            >
              {/* Removed Image */}
            </div>
            Room Details
          </button>
        )}

        <button
          className="property-filter-btn"
          style={{
            backgroundColor: "#F9CC41",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => setActiveSection("amenities")}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            {/* Removed Image */}
          </div>
          Property Amenities
        </button>
        
        <button
          className="property-filter-btn"
          style={{
            backgroundColor: "#F77D1E",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => setActiveSection("facilities")}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            {/* Removed Image */}
          </div>
          Property Facilities
        </button>

        <button
          className="property-filter-btn"
          style={{
            backgroundColor: "#EE414B",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => setActiveSection("services")}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            {/* Removed Image */}
          </div>
          Property Services
        </button>

        <button
          className="property-filter-btn"
          style={{
            backgroundColor: "#A334CF",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => setActiveSection("houseRules")}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            {/* Removed Image */}
          </div>
          Property Rules
        </button>

        <button
          className="property-filter-btn"
          style={{
            backgroundColor: "#0C58BF",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => setActiveSection("cancellation")}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            {/* Removed Image */}
          </div>
          Cancellation
        </button>
      </div>

      {renderSection()}
    </div>
  );
}
