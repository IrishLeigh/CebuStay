import React, { useState } from "react";
import "../css/BannerOffers.css"; // Import your CSS file
import { Box } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "axios";
import Search from "./Search";

export default function BannerOffers({
  accommodations,
  setAccommodationList,
  onSearchUpdate,
  originalAccommodationList,
}) {
  const [guestCapacity, setGuestCapacity] = useState(null);
  const [availability, setAvailability] = useState({
    startDate: null,
    endDate: null,
  });
  const [checkin_date, setCheckin_date] = useState(null);
  const [checkout_date, setCheckout_date] = useState(null);

  const fetchProperties = async (checkin_date, checkout_date, guest_count) => {
    const accList = originalAccommodationList;
    console.log("Originallist: ", originalAccommodationList);
    const formattedCheckinDate = new Date(checkin_date)
      .toISOString()
      .slice(0, 10);
    const formattedCheckoutDate = new Date(checkout_date)
      .toISOString()
      .slice(0, 10);

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/getavailableproperties",
        {
          params: {
            checkin_date: formattedCheckinDate,
            checkout_date: formattedCheckoutDate,
            guest_count,
          },
        }
      );

      const availablePropertyIds = response.data.map((item) => item.propertyid);
      console.log("Available Property Ids:", availablePropertyIds);
      const filteredAccommodations = accList.filter((accommodation) =>
        availablePropertyIds.includes(accommodation.propertyid)
      );
      console.log(filteredAccommodations);
      setAccommodationList(filteredAccommodations);
      // Do something with filteredAccommodations if needed
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchAvailability = ({ startDate, endDate, guestCapacity }) => {
    setAvailability({ startDate, endDate });
    setGuestCapacity(guestCapacity);
    fetchProperties(startDate, endDate, guestCapacity);
    setCheckin_date(startDate);
    setCheckout_date(endDate);

    // Call the parent callback with updated values
    if (onSearchUpdate) {
      onSearchUpdate({
        guestCapacity,
        checkin_date: startDate,
        checkout_date: endDate,
      });
      // console.log("NADAWAT NAKO FROM SEARCH", {
      //   guestCapacity,
      //   checkin_date: startDate,
      //   checkout_date: endDate,
      // });
    }
  };

  return (
    <>
      <Search
        onSearch={handleSearchAvailability}
        accommodations={accommodations}
        setAccommodationList={setAccommodationList}
      />
      <Box className="bannerOffers">
        <Box className="perfectStay-cntr">
          <p className="perfectStay">Find and Book your Perfect</p>
        </Box>
        <Box className="offers-cntr">
          <Box className="offers">
            <DarkModeIcon
              className="offers-icon"
              sx={{ color: "white", fontSize: { xs: "2rem", md: "3rem" } }}
            />
            <p>Book accommodations tailored to your vibe</p>
          </Box>
          <Box className="offers">
            <LocalOfferIcon
              className="offers-icon"
              sx={{ color: "white", fontSize: { xs: "2rem", md: "3rem" } }}
            />
            <p>Pay with ease with our options</p>
          </Box>
          <Box className="offers">
            <CalendarMonthIcon
              className="offers-icon"
              sx={{ color: "white", fontSize: { xs: "2rem", md: "3rem" } }}
            />
            <p>Flexible booking options </p>
          </Box>
        </Box>
      </Box>
    </>
  );
}
