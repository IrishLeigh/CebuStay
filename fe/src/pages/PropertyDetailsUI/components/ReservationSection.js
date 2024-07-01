import React from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "../css/ReservationSection.css";



export default function ReservationSection({
  checkInDate,
  checkOutDate,
  handleCheckInChange,
  handleCheckOutChange,
  handleReserveClick,
  guestCount,
  handleGuestCountChange,
}) {
  return (
    <Paper className="reservation-cntr" sx={{borderRadius:'12px'}} >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <div className="reservation-price">Php 1,000.00 </div>
          <div className="reservation-night">night </div>
        </div>
        <div className="reservation-details">
          <div className="checkin-out-cntr" >
            <div className="date-picker-cntr" >
              <DatePicker
                label="Check-in"
                value={checkInDate}
                onChange={handleCheckInChange}
                minDate={dayjs()}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px',
                  },
                }}
              />
              </div>
              <div className="date-picker-cntr" >
              <DatePicker
                label="Check-out"
                value={checkOutDate}
                onChange={handleCheckOutChange}
                minDate={checkInDate ? checkInDate.add(1, "day") : dayjs()}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                    
                  },
                }}
              />
            </div>
          </div>
          <TextField
            type="number"
            value={guestCount}
            onChange={handleGuestCountChange}
            fullWidth
            label="Guests"
            mt={3}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
        </div>
      </LocalizationProvider>
    
     
      {/* <Typography
        style={{ fontSize: "1.6rem", fontFamily: "Poppins", textAlign: "left" }}
      >
        {guestCount} Guest{guestCount > 1 ? "s" : ""}
      </Typography> */}
    
      <button
        className="reserve-btn"
        onClick={handleReserveClick}
      >
        Reserve
      </button>

    
    </Paper>
  );
}
