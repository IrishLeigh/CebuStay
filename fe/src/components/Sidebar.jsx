import { Drawer, List, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, EventNote as EventNoteIcon, Message as MessageIcon, Person as PersonIcon } from "@mui/icons-material";

const Sidebar = () => {
  const location = useLocation();

  // State to track the active item based on the current path
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const buttonStyles = {
    padding: "12px 16px", // Add padding
    marginBottom: "10px", // Add margin between items
    letterSpacing: "0.5rem", // Add letter spacing
    "&:hover": {
      backgroundColor: "#1976D2", // Slightly darker blue when hovered
    },
    "&.Mui-selected": {
      backgroundColor: "#ffffff", // White background when selected
      color: "#1976D2", // Blue text color when selected
      "& .MuiListItemIcon-root": {
        color: "#1976D2", // Blue icon color when selected
      },
    },
    "& .MuiListItemIcon-root": {
      color: "#ffffff", // White icon color
    },
    "& .MuiListItemText-primary": {
      color: "#ffffff", // White text color
    },
    "&.Mui-selected .MuiListItemText-primary": {
      color: "#1976D2", // Blue text color when selected
    },
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        backgroundColor: "#2196f3", // Blue background color
        color: "#ffffff", // White text color
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#16B4DD", // Blue background color
          color: "#ffffff", // White text color
        },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem 0' }}>
        <img src="/logo_white.png" alt="Logo" style={{ width: '10rem' }} />
      </div>
      <List>
        <ListItemButton
          selected={activeItem === "/listings"}
          onClick={() => setActiveItem("/listings")}
          component={Link}
          to="/listings"
          sx={buttonStyles}
        >
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Listings" />
        </ListItemButton>
        <ListItemButton
          selected={activeItem === "/reservation"}
          onClick={() => setActiveItem("/reservation")}
          component={Link}
          to="/reservation"
          sx={buttonStyles}
        >
          <ListItemIcon><EventNoteIcon /></ListItemIcon>
          <ListItemText primary="Reservation" />
        </ListItemButton>

        {/* CALENDAR */}
        <ListItemButton
          selected={activeItem === "/calendar"}
          onClick={() => setActiveItem("/calendar")}
          component={Link}
          to="/calendar"
          sx={buttonStyles}
        >
          <ListItemIcon><MessageIcon /></ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItemButton>
        <ListItemButton
          selected={activeItem === "/message"}
          onClick={() => setActiveItem("/message")}
          component={Link}
          to="/message"
          sx={buttonStyles}
        >
          <ListItemIcon><MessageIcon /></ListItemIcon>
          <ListItemText primary="Message" />
        </ListItemButton>
        <ListItemButton
          selected={activeItem === "/profile"}
          onClick={() => setActiveItem("/profile")}
          component={Link}
          to="/profile"
          sx={buttonStyles}
        >
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
