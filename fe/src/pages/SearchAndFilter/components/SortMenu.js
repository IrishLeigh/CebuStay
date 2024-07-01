import { Box } from "@mui/material";
import React from "react";
import "../css/SortMenu.css"; // Import your CSS file

export default function SortMenu() {
  return (
    <Box className="sort-menu" sx={{ marginBottom: '1rem' }}>
      <button className="sort-btn">Sort</button>
      <button className="sort-btn">Best Match</button>
      <button className="sort-btn">Top reviewed</button>
      <button className="sort-btn">Hidden Jewels</button>
      <button className="sort-btn">Hot Deals</button>
    </Box>
  );
};
