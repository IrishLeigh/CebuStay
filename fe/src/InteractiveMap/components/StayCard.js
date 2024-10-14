import React, { useState } from "react";
import "./StayCard.css"; // Import the CSS for styling the card
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function StayCard({ stay, onClose }) {
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();

  const handleView = (e, propertyid) => {
    // Construct query params
    const queryParams = new URLSearchParams({
      guestCapacity: '', // Default to empty string if null
      checkin_date: '', // Default to empty string if null
      checkout_date: '', // Default to empty string if null
    }).toString();

    console.log("Query Params:", queryParams);
  
    // Navigate to the property page with query parameters
    navigate(`/accommodation/property/${propertyid}?${queryParams}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  console.log("Stay:", stay);
  // Set default empty arrays if landmarks are undefined
  const landmarks = stay.landmarks || [];

  return (
    <div className="stay-card">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <img src={stay.propertyFiles[0].src} alt={stay.name} className="stay-image" style={{ width: "100%", objectFit: "cover",  }} />
      <div className="tabs">
        <div
          className={`tab ${activeTab === "details" ? "active" : ""}`}
          onClick={() => handleTabChange("details")}
        >
          Details
        </div>
        <div
          className={`tab ${activeTab === "amenities" ? "active" : ""}`}
          onClick={() => handleTabChange("amenities")}
        >
          Amenities
        </div>
      </div>
      <div className={`tab-content ${activeTab === "details" ? "active" : ""}`}>
        <h3>{stay.name}</h3>
        <p>{stay.description}</p>
        <p><strong>Location:</strong> {stay.address}</p>
      </div>
      <div className={`tab-content ${activeTab === "amenities" ? "active" : ""}`}>
        <p><strong>Amenities:</strong></p>
        <ul>
          {stay.amenities && stay.amenities.length > 0 ? (
            stay.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))
          ) : (
            <li>No amenities available</li>
          )}
        </ul>
      </div>
      <div className={`tab-content ${activeTab === "amenities" ? "active" : "active"}`}>
        <Button variant="contained" color="primary"  onClick={(e) => handleView(e, stay.propertyid)} sx={{ display: "block", margin: "auto" }}>
          View Property
        </Button>
      </div>
    </div>
  );
}
