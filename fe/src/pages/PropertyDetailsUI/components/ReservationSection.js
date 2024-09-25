import React, { useState, useEffect } from "react";
import { Paper, TextField, Button } from "@mui/material";
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
  propertyinfo,
}) {
  const [propertyInfo, setPropertyInfo] = useState();
  const [price , setPrice] = useState();

  useEffect(() => {
    try {
      if (propertyinfo) {
        setPropertyInfo(propertyinfo);
        setPrice(propertyinfo?.property_unitdetails[0]?.unitpricing?.min_price || 1000);

        // console.log("PROPERTY INFO", propertyinfo);

      }
    } catch (err) {
      console.log(err);
    }
  }, [propertyinfo]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  
console.log("PRICE", price);
  return (
    <Paper className="reservation-cntr" sx={{ borderRadius: "12px" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="reservation-price">{formatPrice(price)}</div>
          <div className="reservation-night">night </div>
        </div>
        <div className="reservation-details">
          <div className="checkin-out-cntr">
            <div className="date-picker-cntr">
              <DatePicker
                label="Check-in"
                value={checkInDate}
                onChange={handleCheckInChange}
                minDate={dayjs()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                  },
                }}
              />
            </div>
            <div className="date-picker-cntr">
              <DatePicker
                label="Check-out"
                value={checkOutDate}
                onChange={handleCheckOutChange}
                minDate={checkInDate ? checkInDate.add(1, "day") : dayjs()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderTopRightRadius: "12px",
                    borderBottomRightRadius: "12px",
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
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
        </div>
      </LocalizationProvider>

      <button className="reserve-btn" onClick={handleReserveClick}>
        Reserve
      </button>
    </Paper>
  );
}
