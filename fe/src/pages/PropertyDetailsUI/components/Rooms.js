import React from "react";
import Bed from '@mui/icons-material/Bed';
import Sofa from '@mui/icons-material/Chair';
import Kitchen from '@mui/icons-material/Countertops';
import Bath from '@mui/icons-material/Bathtub';
import Room from '@mui/icons-material/MeetingRoom';

export default function Rooms({ room }) {
  const getIcon = (roomName) => {
    switch(roomName) {
      case "Bedroom":
        return <Bed sx={{ color: "#16B4DD" }} />;
      case "Living room":
        return <Sofa sx={{ color: "#16B4DD" }} />;
      case "Kitchen":
        return <Kitchen sx={{ color: "#16B4DD" }} />;
      case "Bathroom":
        return <Bath sx={{ color: "#16B4DD" }} />;
      default:
        return <Room sx={{ color: "#16B4DD" }} />;
    }
  };

  return (
    <div className="rooms">
      {getIcon(room.name)}
      <div className="rooms-name">{room.name}</div>
      <div className="rooms-details">{room.details}</div>
    </div>
  );
}
