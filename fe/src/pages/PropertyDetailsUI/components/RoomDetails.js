import { Divider, Paper } from "@mui/material";
import React from "react";
import ArrowRight from '@mui/icons-material/Send';
import Rooms from "./Rooms";

export default function RoomDetails({ rooms }) {
  return (
    <Paper className="info-cntr" sx={{ borderRadius: '12px' }}>
      <div className="info-title-cntr">
        <ArrowRight sx={{ color: "#16B4DD" }} />
        <div>Room Details</div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc" }} />

      <div className="rooms-cntr">
        {rooms.map((room, index) => (
          <Rooms key={index} room={room} />
        ))}

      </div>
    
   </Paper>
  );
}