import React from "react";
import { Box, Divider, Paper } from "@mui/material";
import "../css/PropertyInfo.css";
import RoomDetails from "./RoomDetails";
import RoomGallery from "./RoomGallery";

export default function PropertyInfo() {
  
  const rooms = [
    { name: "Bedroom", details: "1 double bed" },
    { name: "Living room" },
    { name: "Bathroom" },
    {name: 'meeting room'}
  ];

  return (
    <div>
      <Box className="sort-menu">
        <button className="sort-btn">View Info</button>
        <button className="sort-btn">Gallery</button>
        <button className="sort-btn">Room Details</button>
        <button className="sort-btn">Property Amenities</button>
        <button className="sort-btn">Property Facilities</button>
        <button className="sort-btn">Property Services</button>
      </Box>
      {/* <RoomGallery/> */}
     <RoomDetails rooms={rooms}/>
     
    </div>
  );
}
