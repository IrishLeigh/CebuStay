import React from "react";
import "../css/BannerOffers.css"; // Import your CSS file
import { Box } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function BannerOffers() {
  return (
    <Box className="bannerOffers">
      <Box className="perfectStay-cntr">
        <p className="perfectStay">Find and Book your Perfect</p>
      </Box>
      <Box className="offers-cntr">
        <Box className="offers">
          <DarkModeIcon className="offers-icon" sx={{ color: 'white', fontSize: { xs: '2rem', md: '3rem' } }} />
          <p>Earn rewards on every night you stay</p>
        </Box>
        <Box className="offers">
          <LocalOfferIcon className="offers-icon" sx={{ color: 'white', fontSize: { xs: '2rem', md: '3rem' } }} />
          <p>Save more with Member Prices</p>
        </Box>
        <Box className="offers">
          <CalendarMonthIcon className="offers-icon" sx={{ color: 'white', fontSize: { xs: '2rem', md: '3rem' } }} />
          <p>Free cancellation options if plans change</p>
        </Box>
      </Box>
    </Box>
  );
}
