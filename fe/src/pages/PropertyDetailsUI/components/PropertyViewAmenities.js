import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Divider } from "@mui/material";
import ArrowRight from "@mui/icons-material/Send";
import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
import KitchenIcon from "@mui/icons-material/Kitchen"; // Refrigerator
import TvIcon from "@mui/icons-material/Tv"; // Television
import WorkIcon from "@mui/icons-material/Work"; // Workspace
import LocalBarIcon from "@mui/icons-material/LocalBar"; // Mini Bar
import ShowerIcon from "@mui/icons-material/Shower"; // Toiletries
import MicrowaveIcon from "@mui/icons-material/Microwave"; // Microwave
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Fallback icon for unknown amenities
import AcUnitIcon from "@mui/icons-material/AcUnit"; // Air Conditioning alternative
import "../css/PropertyBenefits.css";

// MUI icons for amenities
const amenitiesIcons = {
  Toiletries: <ShowerIcon style={{ color: "#16B4DD" }} />,
  "Air Conditioning": <AcUnitIcon style={{ color: "#16B4DD" }} />,
  "Wi-Fi": <NetworkWifiIcon style={{ color: "#16B4DD" }} />,
  "Mini Bar": <LocalBarIcon style={{ color: "#16B4DD" }} />,
  Workspace: <WorkIcon style={{ color: "#16B4DD" }} />,
  Television: <TvIcon style={{ color: "#16B4DD" }} />,
  Refrigerator: <KitchenIcon style={{ color: "#16B4DD" }} />,
  Microwave: <MicrowaveIcon style={{ color: "#16B4DD" }} />,
};

// Component to render a list of amenities with MUI icons
const Amenities = ({ amenities = [] }) => {
  console.log("Amenities data:", amenities); // Log the incoming data for debugging

  // Filter out duplicate amenities
  const uniqueAmenities = Array.from(
    new Set(amenities.map((a) => a.amenity_name))
  ).map((name) => amenities.find((a) => a.amenity_name === name));

  return (
    <Paper className="info-cntr" sx={{ borderRadius: "12px" }}>
      <div className="info-title-cntr">
        <ArrowRight sx={{ color: "#16B4DD" }} />
        <div>Amenities</div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc" }} />
      <div className="amenity-cntr">
        {uniqueAmenities.length > 0 ? (
          uniqueAmenities.map((amenity) => (
            <div className="each-amenity" key={amenity.amenity_name}>
              <div style={{ marginRight: "8px" }}>
                {amenitiesIcons[amenity.amenity_name] || (
                  <HelpOutlineIcon style={{ color: "#16B4DD" }} />
                )}
              </div>
              <div className="rooms-name">{amenity.amenity_name}</div>
            </div>
          ))
        ) : (
          <div className="no-amenites">No Amenities Available</div>
        )}
      </div>
    </Paper>
  );
};

// Main component to fetch and display property amenities
export default function PropertyViewAmenities({ propertyinfo }) {
  const [loading, setLoading] = useState(true); // Loading state
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
        <Amenities amenities={propertyInfo?.property_amenities || []} />
      )}
    </div>
  );
}
