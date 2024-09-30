import React, { useState } from "react";
import "./StayCard.css"; // Import the CSS for styling the card

export default function StayCard({ stay, onClose }) {
  const [activeTab, setActiveTab] = useState("details");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Set default empty arrays if landmarks are undefined
  const landmarks = stay.landmarks || [];

  return (
    <div className="stay-card">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <img src={stay.imageUrl} alt={stay.name} className="stay-image" />
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
        <div
          className={`tab ${activeTab === "landmarks" ? "active" : ""}`}
          onClick={() => handleTabChange("landmarks")}
        >
          Landmarks
        </div>
      </div>
      <div className={`tab-content ${activeTab === "details" ? "active" : ""}`}>
        <h3>{stay.name}</h3>
        <p>{stay.description}</p>
        <p><strong>Location:</strong> {stay["city name"]}</p>
      </div>
      <div className={`tab-content ${activeTab === "amenities" ? "active" : ""}`}>
        {/* <p><strong>Closest Attraction:</strong></p>
        <ul>
          <li>{stay.closestAttraction || "No data available"}</li>
        </ul> */}
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
      <div className={`tab-content ${activeTab === "landmarks" ? "active" : ""}`}>
        <p><strong>Popular Landmarks:</strong></p>
        <ul>
          {landmarks.length > 0 ? (
            landmarks.map((landmark, index) => (
              <li key={index}>{landmark}</li>
            ))
          ) : (
            <li>No landmarks available</li>
          )}
        </ul>
        <p><strong>Closest Attraction:</strong></p>
        <ul>
          <li>{stay.closestAttraction || "No data available"}</li>
        </ul>
      </div>
    </div>
  );
}

