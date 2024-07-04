import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import PropertyViewAmenities from "./PropertyViewAmenities";
import PropertyViewFacilities from "./PropertyViewFacilities";
import PropertyViewServices from "./PropertyViewServices";
import PropertyHouseRules from "./PropertyHouseRules";

export default function ViewProperty() {
  const [view, setView] = useState(null);

  const renderView = () => {
    switch (view) {
      case "amenities":
        return <PropertyViewAmenities />;
      case "facilities":
        return <PropertyViewFacilities />;
      case "services":
        return <PropertyViewServices />;
      case "houseRules":
        return <PropertyHouseRules />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Box>
        <Box className="sort-menu">
          <button className="sort-btn" onClick={() => setView(null)}>
            Properties
          </button>
          <button className="sort-btn" onClick={() => setView("amenities")}>
            Property Amenities
          </button>
          <button className="sort-btn" onClick={() => setView("facilities")}>
            Property Facilities
          </button>
          <button className="sort-btn" onClick={() => setView("services")}>
            Property Services
          </button>
          <button className="sort-btn" onClick={() => setView("houseRules")}>
            Property House Rules
          </button>
          <button className="sort-btn" onClick={() => setView("cancellation")}>
            Cancellation
          </button>
        </Box>
        {renderView()}
      </Box>
    </Container>
  );
}
